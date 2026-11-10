// Generates src/api/schema.d.ts from src/api/openapi.public.yaml (a copy of the backend's openapi.public.yaml).
//
//   npm run api:types          regenerate src/api/schema.d.ts
//   npm run api:check          fail if src/api/schema.d.ts does not match the schema file (used in CI)
//   npm run api:sync -- PATH   copy PATH (the backend's openapi.public.yaml) over the schema file, then regenerate
//
// openapi-typescript needs TypeScript 5 while the app uses a newer one, so it is installed on its own in
// tools/api-types and run from there.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tool = join(root, "tools", "api-types");
const schemaFile = join(root, "src", "api", "openapi.public.yaml");
const typesFile = join(root, "src", "api", "schema.d.ts");
const cli = join(tool, "node_modules", "openapi-typescript", "bin", "cli.js");

const mode = process.argv[2];
const normalise = (text) => text.replace(/\r\n/g, "\n");

function generate(output) {
    if (!existsSync(cli)) {
        execFileSync("npm", ["ci", "--silent", "--prefix", tool], { stdio: "inherit", shell: true });
    }
    execFileSync(process.execPath, [cli, schemaFile, "-o", output], { stdio: "pipe" });
}

if (mode === "sync") {
    const source = process.argv[3];
    if (!source || !existsSync(source)) {
        console.error("Usage: npm run api:sync -- <path to the backend's openapi.public.yaml>");
        process.exit(1);
    }
    copyFileSync(source, schemaFile);
    generate(typesFile);
    console.log("Copied the schema and regenerated src/api/schema.d.ts");
} else if (mode === "check") {
    const dir = mkdtempSync(join(tmpdir(), "api-types-"));
    try {
        const fresh = join(dir, "schema.d.ts");
        generate(fresh);
        if (normalise(readFileSync(fresh, "utf8")) !== normalise(readFileSync(typesFile, "utf8"))) {
            console.error("src/api/schema.d.ts is out of date with src/api/openapi.public.yaml. Run `npm run api:types` and commit it.");
            process.exit(1);
        }
        console.log("src/api/schema.d.ts matches src/api/openapi.public.yaml");
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
} else {
    generate(typesFile);
    console.log("Regenerated src/api/schema.d.ts");
}
