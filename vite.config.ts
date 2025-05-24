// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
dotenv.config()
const PORT = Number(process.env.PORT || 5173)
const HOST = process.env.HOST

console.log('HOST', HOST);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: PORT,
    host: HOST,
    proxy: {
      '/ws': {
        target: 'wss://dhya-farms-api-latest.onrender.com',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});