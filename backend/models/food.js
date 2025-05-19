const pool = require('../db');

async function addFoodItem({ title, description, image, lat, lng }) {
  const res = await pool.query(
    `INSERT INTO food_items (title, description, image, lat, lng)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, image, lat, lng]
  );
  return res.rows[0];
}

async function getNearbyFood(lat, lng, radius = 5) {
  const res = await pool.query(
    `SELECT *, 
        (6371 * acos(cos(radians($1)) * cos(radians(lat)) * 
        cos(radians(lng) - radians($2)) + 
        sin(radians($1)) * sin(radians(lat)))) AS distance 
     FROM food_items 
     HAVING distance < $3 
     ORDER BY distance`,
    [lat, lng, radius]
  );
  return res.rows;
}

module.exports = {
  addFoodItem,
  getNearbyFood,
};
