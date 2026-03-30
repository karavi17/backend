import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'running', message: 'MangaFlow Backend is operational' });
});

// Manga route
app.get('/manga/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const response = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe&contentRating[]=suggestive`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('❌ Error fetching manga:', error);
    res.status(500).json({ error: 'Failed to fetch manga data' });
  }
});

// IMPORTANT: bind to 0.0.0.0 for Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
