require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const foodRoutes = require('./routes/foods');
const pickupRoutes = require('./routes/pickups');
const userRoutes = require('./routes/users');
const { initDatabase } = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/foods', foodRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ✅ Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ✅ Serve index.html for base route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ✅ Serve about.html if specifically accessed
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'about.html'));
});

// Start the server after database connection
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
