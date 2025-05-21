const { pool } = require('../db');

exports.getAllFoods = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM foods WHERE status = $1 ORDER BY created_at DESC', ['available']);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getNearbyFoods = async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  try {
    const query = `
      SELECT *, (6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude))
      )) AS distance
      FROM foods
      WHERE status = 'available'
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) <= $3
      ORDER BY distance ASC
    `;
    const result = await pool.query(query, [lat, lng, radius]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM foods WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Food not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createFood = async (req, res) => {
  try {
    const {
      title, category, description, cuisine_type, servings,
      best_before, location, latitude, longitude, image_url,
      provider_id, whatsapp_number // ✅ Added this field
    } = req.body;

    // ✅ Basic validation
    if (!title || !category || !location || !whatsapp_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO foods (
        title, category, description, cuisine_type, servings,
        best_before, location, latitude, longitude, image_url,
        provider_id, whatsapp_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        title, category, description, cuisine_type, servings,
        best_before, location, latitude, longitude, image_url,
        provider_id || 1, whatsapp_number
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting food:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, category, description, cuisine_type, servings,
      best_before, location, latitude, longitude, image_url, status
    } = req.body;
    const result = await pool.query(
      `UPDATE foods SET title = $1, category = $2, description = $3, cuisine_type = $4,
        servings = $5, best_before = $6, location = $7, latitude = $8, longitude = $9,
        image_url = $10, status = $11, updated_at = NOW() WHERE id = $12 RETURNING *`,
      [title, category, description, cuisine_type, servings, best_before, location, latitude, longitude, image_url, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Food not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM foods WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
