import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use('/api/sync-tiktok', async (req, res) => {
          try {
            const { default: handler } = await import('./api/sync-tiktok.js');
            await handler(req, res);
          } catch (e) {
            console.error('API middleware error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false,
    host: true
  }
})
