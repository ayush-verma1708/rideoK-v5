import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/directions', async (req, res) => {
  const { start, end } = req.query;

  try {
    const response = await axios.get(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        params: {
          api_key: process.env.OPENROUTE_API_KEY || '5b3ce3597851110001cf62483628cb4427c2430b96c354f4d63058fd',
          start,
          end,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenRouteService Error:', error.message);
    res.status(500).json({ message: 'Error fetching directions' });
  }
});

export default router;