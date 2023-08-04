const express = require('express');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

const donationController = require('../controllers/donationController');

router.post('/donations', authenticate(), donationController.createDonation);
router.get('/donations', donationController.getAllDonations);
router.get('/donations/:donationId', donationController.getDonationById);
router.put(
  '/donations/:donationId/status',
  authenticate(),
  donationController.updateDonationStatus
);
router.delete(
  '/donations/:donationId',
  authenticate(),
  donationController.deleteDonation
);
router.get(
  '/events/:eventId/totalDonations',
  authenticate(),
  donationController.getTotalDonationsForEvent
);
router.get('/donations/topDonors', donationController.getTopDonors);

module.exports = router;
