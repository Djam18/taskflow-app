import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CRA is dead. Vite is the future.
// 10x faster HMR: Vite uses native ESM + esbuild for dev
// Build: rollup (much faster than webpack)
// No more 'react-scripts' magic — full control over the config

export default defineConfig({
  plugins: [
    react(), // @vitejs/plugin-react uses Babel for Fast Refresh
  ],
  build: {
    outDir: 'build', // keep same output dir as CRA for compatibility
    sourcemap: true,
  },
  server: {
    port: 3000, // keep same port as CRA
    open: true,
  },
});
