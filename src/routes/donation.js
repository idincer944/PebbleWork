const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');

const router = express.Router();

const donationController = require('../controllers/donationController');

router.post('/:eventId', authenticate, donationController.createDonation);
router.get('/', donationController.getAllDonations);
router.get('/:donationId', authenticate, donationController.getDonationById);
router.put(
  '/:donationId/status',
  authenticate,
  donationController.updateDonationStatus
);
router.delete(
  '/:donationId',
  authenticate,
  isAdmin,
  donationController.deleteDonation
);
router.get(
  '/:eventId/totalDonations',
  authenticate,
  donationController.getTotalDonationsForEvent
);
router.get('/topDonors', authenticate, donationController.getTopDonors);

module.exports = router;
