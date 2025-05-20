const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodController');

router.get('/', controller.getAllFoods);
router.get('/nearby', controller.getNearbyFoods);
router.get('/:id', controller.getFoodById);
router.post('/', controller.createFood);
router.put('/:id', controller.updateFood);
router.delete('/:id', controller.deleteFood);

module.exports = router;
