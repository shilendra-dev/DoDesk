
import react from '@vitejs/plugin-react'

import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Get the directory name of the current module (vite.config.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
