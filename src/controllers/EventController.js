const Event = require("../models/event")


module.exports={

    getAllEvents : async (req, res) => {
        try {
          const events = await Event.find().populate('createdBy', 'name'); // so we can gte the user's name also
          res.send(events);
        } catch (error) {
          res.status(500).send('Failed to fetch events: ' + error.message);
        }
      }

}