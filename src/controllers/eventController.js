const Event = require('../models/event');
const jwt = require('jsonwebtoken');
module.exports = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({});
      res.status(200).send(events);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

   getAllUserEvents: async (req, res) => {
    
    const userId = req.user.user_id;
  
    try {
      // Find all events that were created by the user with the given ID
      const userEvents = await Event.find({ createdBy: userId }).populate({ path: 'createdBy',
      select: '-_id firstname lastname avatar',});
  
      res.status(200).json(userEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  createNewEvent: async (req, res) => {
    const {
      name,
      location,
      time,
      description,
      picture
    } = req.body;
  
    if (!name || !location || !time || !description || !picture ) {
      return res.status(400).json({
        error: 'Missing required event data',
      });
    }
   
    const createdBy =req.user.user_id
    try {
      const newEvent = new Event({
        name,
        location,
        time,
        description,
        picture,
        createdBy,
      });
  
      const savedEvent = await newEvent.save();
  
      res.status(201).json(savedEvent); // Success status code 201 - Created
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error while creating event'); // Failure status code 500
    }
  },
  getEventById: async (req, res) => {
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

  deleteEvent: async (req, res) => {
    const { eventId } = req.params;
 
    const userId = req.user.user_id;

    try {
      const event = await Event.findById(eventId);
      if (event.createdBy!=userId) {
        return res.status(403).json({ error: 'you are not allowed to cansle or delete this event' });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      

      
    const eventDate = new Date(event.time);
    const today = new Date();

    // compare event date with today's date
    if (eventDate <= today) {
      return res.status(403).json({ error: "You can't delete past events" });
    }
      //res.status(200).json(event);
      await Event.findByIdAndDelete(eventId);

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while deleting event' });
    }
  },


  updateEvent: async (req, res) => {
    const { eventId } = req.params;
    const eventData = req.body;
    
    const userId = req.user.user_id

    try {
      const event = await Event.findById(eventId);
      if (event.createdBy!=userId) {
        return res.status(403).json({ error: 'you are not allowed to edit this event' });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      // we are not allowing the user to change the other properties.
      event.name = eventData.name || event.name;
      event.location = eventData.location || event.location;
      event.time = eventData.time || event.time;
      event.description = eventData.description || event.description;
      event.picture = eventData.picture || event.picture;

      await event.save();

      res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while updating event' });
    }
  },



  searchEvents: async (req, res) => {
    const searchQuery = req.query.q;

    try {
        const events = await Event.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        res.status(200).json({ message: 'Events found successfully', events });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error while searching events' });
    }
},


 joinEvent :async (req, res) => {
  try {
    const { eventId } = req.params;

    
    const userId = req.user.user_id

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.participants.includes(userId)) {
      return res.status(409).json({ error: 'User is already part of the event' });
    }

    event.participants.push(userId);

    await event.save();
    return res.status(200).json({ message: 'joined successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error while joining event' });
  }
},

leaveEvent : async (req, res) => {
  try {
    const { eventId } = req.params;

    const userId = req.user.user_id

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is already part of the event
    if (!event.participants.includes(userId)) {
      return res.status(409).json({ error: 'User is not part of the event' });
    }

    // Remove the user's ID from the event's participants array
    await Event.updateOne({ _id: eventId }, { $pull: { participants: userId } });


    await event.save();
    return res.status(200).json({ message: 'Left the event successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error while leaving the event' });
  }
}


};
