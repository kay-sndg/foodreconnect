const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodController');
const upload = require('../middlewares/upload'); // ✅ Import multer middleware

router.get('/', controller.getAllFoods);
router.get('/nearby', controller.getNearbyFoods);
router.get('/:id', controller.getFoodById);

// ✅ Use multer for file upload in createFood route
router.post('/', upload.single('image'), controller.createFood);

router.put('/:id', controller.updateFood);
router.delete('/:id', controller.deleteFood);

module.exports = router;
