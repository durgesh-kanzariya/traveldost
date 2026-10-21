const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');
const tripValidator = require('../validators/tripValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.get('/', tripController.getTrips);
router.get('/upcoming', tripController.getUpcomingTrip);
router.get('/:id/checklist-count', tripValidator.tripIdParamRule, validateRequest, tripController.getChecklistCount);
router.post('/', tripValidator.tripRules, validateRequest, tripController.createTrip);
router.put('/:id', tripValidator.tripIdParamRule, tripValidator.tripRules, validateRequest, tripController.updateTrip);
router.delete('/:id', tripValidator.tripIdParamRule, validateRequest, tripController.deleteTrip);

module.exports = router;
