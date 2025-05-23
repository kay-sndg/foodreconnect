const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodController');
const upload = require('../middlewares/upload'); // ✅ Import multer middleware

router.get('/', controller.getAllFoods);
router.get('/nearby', controller.getNearbyFoods);
router.get('/:id', controller.getFoodById);

// ✅ Use the correct field name here
router.post('/', upload.single('foodImage'), controller.createFood);

router.put('/:id', controller.updateFood);
router.delete('/:id', controller.deleteFood);

module.exports = router;
