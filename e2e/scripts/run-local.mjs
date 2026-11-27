// Starts everything the browser tests need, runs them, and stops everything again.
//
//   BACKEND_DIR=../../collageCreationsBackend PYTHON=../../venv/Scripts/python.exe node scripts/run-local.mjs [playwright args]
//
// It needs: a checkout of the backend with its Python dependencies installed (PYTHON is the interpreter of that
// environment, default `python`), a collagecreation.env in the backend's CollageCreation folder (the example file is
// enough; leave REDIS_URL unset), and a Redis server on localhost:6379 (`docker run -d -p 6379:6379 redis:7-alpine`).
// It starts the API on :8000 and one Celery worker, builds the storefront (a production build, because that is what
// customers get) and serves it on :4000, then runs Playwright. Any arguments are passed on to Playwright, for example
// `--headed` or `tests/photo-collage.e2e.ts`.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const e2eDir = path.resolve(here, '..');
const appDir = path.resolve(e2eDir, '..');
const backendDir = path.resolve(process.env.BACKEND_DIR || path.join(appDir, '..', 'collageCreationsBackend'));
// A path (not just a command name) is taken relative to where this was run, not to the backend folder it runs in.
const python = /[\\/]/.test(process.env.PYTHON || '') ? path.resolve(process.env.PYTHON) : process.env.PYTHON || 'python';
const API_PORT = 8000;
const APP_PORT = 4000;

const fail = (message) => {
  console.error(`\n${message}\n`);
  process.exit(1);
};

// `localhost`, as the browser uses it: on some machines (GitHub's runners) it means IPv6, on others IPv4.
const portOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host: 'localhost' });
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
  });

async function waitFor(check, what, seconds = 60) {
  for (let i = 0; i < seconds * 2; i++) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  fail(`Timed out waiting for ${what}.`);
}

if (!existsSync(path.join(backendDir, 'manage.py'))) fail(`No backend found at ${backendDir}. Set BACKEND_DIR to a checkout of collageCreationsBackend.`);
if (!existsSync(path.join(backendDir, 'CollageCreation', 'collagecreation.env'))) {
  fail('The backend has no CollageCreation/collagecreation.env. Copy collagecreation.env.example to it (leave REDIS_URL unset).');
}
if (!(await portOpen(6379))) fail('No Redis on localhost:6379. Start one: docker run -d -p 6379:6379 redis:7-alpine');
for (const port of [API_PORT, APP_PORT]) {
  if (await portOpen(port)) fail(`Port ${port} is already in use. Stop whatever is using it first.`);
}

// A low photo limit for the API, so the tests can show what a customer sees when a request is refused without uploading
// hundreds of photos. A collage needs at least 5 photos, so 5 is the most that can be used. (A real environment variable
// wins over the backend's env file.)
export const MAX_COLLAGE_TILES = '5';

// Checkout tests pay with Stripe's test cards, so they need a Stripe TEST account: E2E_STRIPE_SECRET_KEY (sk_test_...)
// for the API and E2E_STRIPE_PUBLISHABLE_KEY (pk_test_...) for the storefront build. Without both, those tests skip.
// Anything else is refused: a live key here would make the browser tests charge real cards.
const stripeSecret = process.env.E2E_STRIPE_SECRET_KEY || '';
const stripePublishable = process.env.E2E_STRIPE_PUBLISHABLE_KEY || '';
if (stripeSecret || stripePublishable) {
  if (!stripeSecret.startsWith('sk_test_') || !stripePublishable.startsWith('pk_test_')) {
    fail('Set both E2E_STRIPE_SECRET_KEY (sk_test_...) and E2E_STRIPE_PUBLISHABLE_KEY (pk_test_...). Only Stripe TEST keys are accepted.');
  }
}
const stripeEnabled = !!(stripeSecret && stripePublishable);

// A real environment variable wins over the backend's env file.
const backendEnv = { ...process.env, MAX_COLLAGE_TILES, ...(stripeEnabled ? { STRIPE_SECRET_KEY: stripeSecret } : {}) };

const children = [];
function start(name, command, args, options = {}) {
  const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
  child.stdout.on('data', (data) => process.env.E2E_VERBOSE && process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.env.E2E_VERBOSE && process.stderr.write(`[${name}] ${data}`));
  children.push(child);
  return child;
}

function stopAll() {
  for (const child of children) {
    if (child.exitCode !== null || !child.pid) continue;
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F']);
    else child.kill('SIGTERM');
  }
}
process.on('SIGINT', () => { stopAll(); process.exit(130); });
process.on('exit', stopAll);

try {
  console.log('Preparing the database...');
  const migrate = spawnSync(python, ['manage.py', 'migrate', '--noinput'], { cwd: backendDir, encoding: 'utf8' });
  if (migrate.status !== 0) fail(`migrate failed:\n${migrate.stdout}\n${migrate.stderr}`);

  // A staff user (e2e-admin) and one paid order for the admin journey. The command refuses to run unless DEBUG is on.
  const seed = spawnSync(python, ['manage.py', 'seed_e2e_data'], { cwd: backendDir, encoding: 'utf8', env: backendEnv });
  if (seed.status !== 0) fail(`seed_e2e_data failed (${seed.error ? seed.error.message : `exit ${seed.status}`}):
${seed.stdout ?? ''}
${seed.stderr ?? ''}`);

  console.log('Starting the API and a Celery worker...');
  start('api', python, ['manage.py', 'runserver', String(API_PORT), '--noreload'], { cwd: backendDir, env: { ...backendEnv, PYTHONFAULTHANDLER: '1' } });
  start('celery', python, ['-m', 'celery', '-A', 'CollageCreation', 'worker', '--pool=solo', '--loglevel=warning'], { cwd: backendDir, env: backendEnv });

  console.log('Building the storefront...');
  const env = {
    ...process.env,
    VITE_BACKEND_URL: `http://localhost:${API_PORT}/`,
    VITE_STRIPE_KEY: stripePublishable || 'pk_test_replace_me',
  };
  const vite = path.join(appDir, 'node_modules', 'vite', 'bin', 'vite.js');
  const build = spawnSync(process.execPath, [vite, 'build'], { cwd: appDir, env, encoding: 'utf8' });
  if (build.status !== 0) fail(`Build failed:\n${build.stdout}\n${build.stderr}`);
  start('app', process.execPath, [vite, 'preview', '--port', String(APP_PORT), '--strictPort'], { cwd: appDir, env });

  await waitFor(async () => {
    try {
      const response = await fetch(`http://localhost:${API_PORT}/api/health/`);
      return response.ok;
    } catch { return false; }
  }, 'the API to report healthy');
  await waitFor(() => portOpen(APP_PORT), 'the storefront');

  console.log('Running the tests...\n');
  const playwright = path.join(e2eDir, 'node_modules', '@playwright', 'test', 'cli.js');
  // Not spawnSync: while Node waits synchronously it cannot read the API's and worker's output pipes, and a server that
  // prints a lot (the console email backend prints the whole message, logo included) fills the pipe and hangs mid-request.
  const status = await new Promise((resolve) => {
    const playwrightRun = spawn(process.execPath, [playwright, 'test', ...process.argv.slice(2)], {
      cwd: e2eDir,
      stdio: 'inherit',
      env: { ...process.env, APP_URL: `http://localhost:${APP_PORT}`, E2E_STRIPE: stripeEnabled ? '1' : '' },
    });
    playwrightRun.on('exit', (code) => resolve(code ?? 1));
  });
  process.exitCode = status;
  // Debugging a hung request: with E2E_DUMP_STACKS the API is told to print every thread's stack (SIGABRT, Linux only).
  if (status !== 0 && process.env.E2E_DUMP_STACKS && process.platform !== 'win32') {
    children[0].kill('SIGABRT');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
} finally {
  stopAll();
}
