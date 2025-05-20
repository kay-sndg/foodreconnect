// controllers/pickupController.js
const { pool } = require('../db');

exports.createPickup = async (req, res) => {
  try {
    const { food_id, user_id, pickup_time } = req.body;

    const foodCheck = await pool.query(
      'SELECT * FROM foods WHERE id = $1 AND status = $2',
      [food_id, 'available']
    );
    if (foodCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Food is no longer available' });
    }

    const result = await pool.query(
      `INSERT INTO pickups (food_id, user_id, pickup_time)
       VALUES ($1, $2, $3) RETURNING *`,
      [food_id, user_id || 1, pickup_time]
    );

    await pool.query(
      'UPDATE foods SET status = $1 WHERE id = $2',
      ['reserved', food_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating pickup request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE pickups SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    if (status === 'completed') {
      await pool.query(
        'UPDATE foods SET status = $1 WHERE id = $2',
        ['claimed', result.rows[0].food_id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating pickup status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserPickups = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT p.*, f.title, f.location, f.servings
       FROM pickups p
       JOIN foods f ON p.food_id = f.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user pickups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
