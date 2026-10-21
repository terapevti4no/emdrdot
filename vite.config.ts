import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { preferenceBootstrap } from '@terapevti4no/ui/preferences';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] }, optimizeDeps: { exclude: ['@terapevti4no/ui'] }, plugins: [react(), {
  name: 'saved-preferences',
  transformIndexHtml: () => [{ tag: 'script', children: preferenceBootstrap({ storageKey: 'emdrdot:v1', fallbackKeys: ['terapevti4no:v1'] }), injectTo: 'head-prepend' }],
}] });
