// routes/pickups.js
const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');

router.post('/', pickupController.createPickup);
router.put('/:id', pickupController.updatePickupStatus);
router.get('/user/:userId', pickupController.getUserPickups);

module.exports = router;
