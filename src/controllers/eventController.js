const Event = require('../models/event')

module.exports={
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find({});
            res.status(200).send(events); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    

    createNewEvent: async (req, res) => {
        const eventData = req.body;
    
        if (!eventData || !eventData.name || !eventData.location || !eventData.time || !eventData.description || !eventData.picture || !eventData.createdBy) {
            return res.status(400).send("Missing required event data"); // Bad request status code 400
        }
    
        try {
            const newEvent = new Event(eventData);
            const savedEvent = await newEvent.save();
    
            res.status(201).send(savedEvent); // Success status code 201 - Created
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error"); // Failure status code 500
        }
    },


     getEventById : async (req, res) => {
            const { eventId } = req.params;

            try {
                // Assuming there is a model called Event
                const event = await Event.findById(eventId);

                if (!event) {
                return res.status(404).json({ error: 'Event not found' });
                }

                res.status(200).json(event);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        },



        deleteEvent :async (req, res) => {
            const { eventId } = req.params;
          
            try {
              const event = await Event.findById(eventId);
          
              if (!event) {
                return res.status(404).json({ error: 'Event not found' });
              }
              //res.status(200).json(event);
              await Event.findByIdAndDelete(eventId);
          
              res.status(200).json({ message: 'Event deleted successfully' });
            } catch (error) {
              res.status(500).json({ error: 'Internal Server Error while deleting event' });
            }
          }

}