import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        express: resolve(__dirname, 'src/express.ts'),
        server: resolve(__dirname, 'src/server.ts')
      },
      name: 'OpenCollectionPlayground',
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `oc-playground.${format}.js`;
        }
        return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`;
      },
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      external: ['react', 'react-dom', 'express'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          express: 'express',
        },
      },
    },
  },
})
