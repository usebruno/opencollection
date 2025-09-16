import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/standalone.ts'),
      name: 'OpenCollectionPlayground',
      fileName: (format) => `playground.${format === 'es' ? 'esm' : format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      output: {
        // Bundle everything into a single file
        inlineDynamicImports: true,
        manualChunks: undefined,
        globals: {},
        exports: 'named'
      }
    },
    outDir: 'dist-standalone',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  }
}); 