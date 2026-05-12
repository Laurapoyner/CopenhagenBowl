import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'tqhpfyvy9cz9ebr05mftilz2rlysynjr';
const BASE_URL = 'https://manage.sportapp.io/api/sportapp/v1/public';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy routes for SportApp
  app.get('/api/sportapp/tournaments', async (req, res) => {
    try {
      const response = await fetch(`${BASE_URL}/tournaments?apikey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error fetching tournaments:', error);
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  });

  app.get('/api/sportapp/matches', async (req, res) => {
    const { tournament } = req.query;
    try {
      const url = `${BASE_URL}/matches?tournament=${tournament}&apikey=${API_KEY}`;
      console.log(`Proxying request to SportApp: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`SportApp API error: ${response.status} - ${text}`);
        return res.status(response.status).send(text);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error fetching matches:', error);
      res.status(500).json({ error: 'Failed to fetch matches', message: error.message });
    }
  });

  app.get('/api/sportapp/standings', async (req, res) => {
    const { tournament } = req.query;
    try {
      const response = await fetch(`${BASE_URL}/standings?tournament=${tournament}&apikey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error fetching standings:', error);
      res.status(500).json({ error: 'Failed to fetch standings' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
