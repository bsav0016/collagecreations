/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { PUBLIC_ROUTES, buildSitemap, renderRouteHtml } from './src/utils/seo';

// After the build, writes a real file for each public page (build/tips/index.html, ...) and a sitemap, so GitHub Pages
// answers 200 for them instead of 404 and search engines can index them. See src/utils/seo.ts.
function searchPages(): Plugin {
  let outDir = 'build';
  return {
    name: 'search-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      for (const route of PUBLIC_ROUTES) {
        if (!route.path) continue; // the home page is the template itself, handled below
        const dir = path.join(outDir, route.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), renderRouteHtml(template, route));
      }
      const home = PUBLIC_ROUTES.find((route) => !route.path);
      if (home) fs.writeFileSync(path.join(outDir, 'index.html'), renderRouteHtml(template, home));
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemap());
    },
  };
}

export default defineConfig({
  plugins: [react(), searchPages()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
