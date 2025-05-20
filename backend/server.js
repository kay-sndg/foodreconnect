require('dotenv').config();
const express = require('express');
const cors = require('cors');
const foodRoutes = require('./routes/foods');
const pickupRoutes = require('./routes/pickups');
const userRoutes = require('./routes/users');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/foods', foodRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

initDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
