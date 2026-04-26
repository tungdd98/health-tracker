import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  envDir: resolve(appRoot, '../..'),
  plugins: [react()],
  server: {
    port: 4200,
  },
  resolve: {
    alias: {
      '@health-tracker/api': resolve(appRoot, '../../libs/api/src/index.ts'),
      '@health-tracker/forms': resolve(appRoot, '../../libs/forms/src/index.ts'),
      '@health-tracker/state': resolve(appRoot, '../../libs/state/src/index.ts'),
      '@health-tracker/theme': resolve(appRoot, '../../libs/theme/src/index.ts'),
      '@health-tracker/ui': resolve(appRoot, '../../libs/ui/src/index.ts'),
    },
  },
  build: {
    outDir: resolve(appRoot, '../../dist/apps/health-tracker-web'),
    emptyOutDir: true,
  },
});
