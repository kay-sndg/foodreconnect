const express = require('express');
const router = express.Router();
const { addFoodItem, getNearbyFood } = require('../models/food');

router.post('/', async (req, res) => {
  try {
    const food = await addFoodItem(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  try {
    const items = await getNearbyFood(parseFloat(lat), parseFloat(lng));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
