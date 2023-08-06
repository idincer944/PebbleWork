const express = require('express');
<<<<<<< HEAD
const { authenticate } = require('../middleware/authenticate');
=======
const { authenticate, isAdmin } = require('../middleware/authenticate');
>>>>>>> 2bab6d03e3973f0881efd0a26bece702dc832a85

const router = express.Router();

const donationController = require('../controllers/donationController');
<<<<<<< HEAD
router.get('/donations', donationController.getAllDonations);
router.post('/donations', authenticate, donationController.createDonation);
router.get('/donations/:donationId', donationController.getDonationById);
router.put(
  '/donations/:donationId/status',
=======

router.post('/:eventId', authenticate, donationController.createDonation);
router.get('/', donationController.getAllDonations);
router.get('/:donationId', authenticate, donationController.getDonationById);
router.put(
  '/:donationId/status',
>>>>>>> 2bab6d03e3973f0881efd0a26bece702dc832a85
  authenticate,
  donationController.updateDonationStatus
);
router.delete(
<<<<<<< HEAD
  '/donations/:donationId',
  authenticate,
  donationController.deleteDonation
);
router.get(
  '/events/:eventId/totalDonations',
=======
  '/:donationId',
  authenticate,
  isAdmin,
  donationController.deleteDonation
);
router.get(
  '/:eventId/totalDonations',
>>>>>>> 2bab6d03e3973f0881efd0a26bece702dc832a85
  authenticate,
  donationController.getTotalDonationsForEvent
);
router.get('/topDonors', authenticate, donationController.getTopDonors);

module.exports = router;
