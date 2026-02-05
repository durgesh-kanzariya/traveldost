const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

// New Route for the list (Must come BEFORE /:country to avoid conflict)
router.get('/list', guideController.getAllCountries);

router.get('/:country', guideController.getGuideByCountry);

module.exports = router;