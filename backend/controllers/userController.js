// controllers/userController.js
const { pool } = require('../db');

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, organization } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, organization)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, organization]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
