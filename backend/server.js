require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const foodRoutes = require('./routes/foods');
const pickupRoutes = require('./routes/pickups');
const userRoutes = require('./routes/users');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/foods', foodRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ✅ Serve frontend statically
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Fallback to index.html for unknown routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server after DB connects
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
