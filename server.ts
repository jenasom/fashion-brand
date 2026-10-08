import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { createApiApp } from './server/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApiApp();

  // Parse command line arguments for --port or fallback to 3000
  let PORT = Number(process.env.PORT) || 3000;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--port' && process.argv[i + 1]) {
      const parsed = parseInt(process.argv[i + 1], 10);
      if (!isNaN(parsed)) PORT = parsed;
    } else if (process.argv[i].startsWith('--port=')) {
      const parsed = parseInt(process.argv[i].split('=')[1], 10);
      if (!isNaN(parsed)) PORT = parsed;
    }
  }

  const server = http.createServer(app);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false // Prevent separate websocket server on port 24678 from conflicting
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.on('error', (err: any) => {
    console.error('Server error:', err);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  VITE v8.3.0  ready in 180 ms\n\n  ➜  Local:   http://localhost:${PORT}/\n  ➜  Network: http://0.0.0.0:${PORT}/\n`);
    console.log(`ATELIER & ACADÉMIE Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
