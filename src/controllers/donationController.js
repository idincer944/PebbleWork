const { default: mongoose } = require('mongoose');
const Event = require('../models/event');
const User = require('../models/user');
const Donation = require('../models/donation');
const { validateDonation } = require('../utils/validations');
const mailFunctions = require('../utils/mailing/mail-functions');

module.exports = {
  createDonation: async (req, res) => {
    const validationResult = validateDonation(req.body);

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(
        (error) => error.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    try {
      const userId = req.user.user_id;
      const { eventId } = req.params;
      const { amount, currency } = validationResult.value;

      const newDonation = new Donation({
        eventId,
        userId,
        amount,
        currency,
      });

      await newDonation.save();


      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
      event.donations.push(newDonation);

      await event.save();

      mailFunctions.sendThankyouForDonationEmail(
        req.user.email,
        event.name,
        user.firstname,
        amount,
        currency
      );

      res.status(201).json(newDonation);
    } catch (err) {
      console.error('Error creating donation:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  getAllDonations: async (req, res) => {
    // Fetching the associated event and user documents
    try {
      const donations = await Donation.find({})
        .populate('eventId', 'name location')
        .populate('userId', 'username email')
        .exec();

      res.status(200).json(donations);
    } catch (err) {
      console.error('Error fetching donations:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  getDonationById: async (req, res) => {
    try {
      const { donationId } = req.params;
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return res.status(404).json({ error: 'Donation not found.' });
      }
      res.status(200).json(donation);
    } catch (err) {
      console.error('Error fetching donation:', err);
      res.status(500).json({ error: 'Someting went wrong' });
    }
  },

  updateDonationStatus: async (req, res) => {
    try {
      const { donationId } = req.params;
      const { status } = req.body;

      const updateDonation = await Donation.findByIdAndUpdate(
        donationId,
        { $set: { donationStatus: status } },
        { new: true }
      );
      if (!updateDonation) {
        return res.status(404).json({ error: 'Donation not found.' });
      }

      res.status(200).json(updateDonation);
    } catch (err) {
      console.error('Error updating donation status:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  },

  deleteDonation: async (req, res) => {
    try {
      const { donationId } = req.params;
      const deleteDonation = await Donation.findByIdAndDelete(donationId);

      if (!deleteDonation) {
        return res.status(404).json({ error: 'Donation not found.' });
      }
      res.status(200).json({ message: 'Donaiton deleted successfully.' });
    } catch (err) {
      console.error('Error deleting donation:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  },

  getTotalDonationsForEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const totalDonations = await Donation.aggregate([
        // filter donation by donation Id
        { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
        // group remaining documents by event id and calculate total amount
        { $group: { _id: `$eventId`, totalAmount: { $sum: `$amount` } } },
        // projects the donor (renamed from _id) and amount fields for the output.
        { $project: { _id: 0, donor: `$_id`, amount: '$totalAmount' } },
      ]);
      const result = totalDonations.length ? totalDonations[0].totalAmount : 0;

      res.status(200).json({ totalDonations: result });
    } catch (err) {
      console.error('Error calculating total donations:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  },

  getTopDonors: async (req, res) => {
    try {
      const topDonors = await Donation.aggregate([
        { $group: { _id: `$userId`, totalDonation: { $sum: `$amount` } } },
        // sorts the grouped data in descending order based on total amount, top donors appear at the beginning
        { $sort: { totalDonation: -1 } },
        // limits the result to the top 10 donors
        { $limit: 10 },
      ]);
      res.status(200).json(topDonors);
    } catch (err) {
      console.error('Error fetching top donors:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  },
};
