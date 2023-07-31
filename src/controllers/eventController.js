const Event = require('../models/event');
//const jwt = require('jsonwebtoken');
const {validateEvent} = require('../utils/validations');
const mailFunctions = require('../utils/mailing/mail-functions');

module.exports = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({}).populate({
        path: 'participants',
        select: 'username avatar',
      });
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
      const userEvents = await Event.find({ createdBy: userId }).populate({
        path: 'createdBy',
        select: '-_id firstname lastname avatar',
      });

      res.status(200).json(userEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createNewEvent: async (req, res) => {
    const validationResult = validateEvent(req.body);

    if (validationResult.error) {
      // Validation failed, handle the error with custom messages
      const errorMessages = validationResult.error.details.map(
        (error) => error.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    const { name, location, time, description, picture,category } =
      validationResult.value;

    const createdBy = req.user.user_id;

    try {
      const newEvent = new Event({
        name,
        location,
        time,
        description,
        picture,
        category,
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
 
      const event = await Event.findById(eventId)

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  cancelEvent: async (req, res) => {
    const { eventId } = req.params;

    const userId = req.user.user_id;

    try {
      const event = await Event.findById(eventId);
      if (event.createdBy != userId) {
        return res
          .status(403)
          .json({
            error: 'you are not allowed to cancel or delete this event',
          });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const eventDate = new Date(event.time);
      const today = new Date();

      // compare event date with today's date
      if (eventDate <= today) {
        return res.status(403).json({ error: "You can't cancel past events" });
      }
      //res.status(200).json(event);
       const eventToCancel = await Event.findById(eventId);
       eventToCancel.isPublished=false
       await eventToCancel.save()
      res.status(200).json({ message: 'Event canceled successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while deleting event' });
    }
  },

  updateEvent: async (req, res) => {
    const { eventId } = req.params;
    const eventData = req.body;

    const userId = req.user.user_id;

    try {
      const event = await Event.findById(eventId);
      if (event.createdBy != userId) {
        return res
          .status(403)
          .json({ error: 'you are not allowed to edit this event' });
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
      event.maxParticipants = eventData.maxParticipants || event.maxParticipants;
      event.isPublished = eventData.hasOwnProperty('isPublished')? eventData.isPublished: event.isPublished;
      event.registrationDeadline = eventData.registrationDeadline || event.registrationDeadline;
      event.eventWebsite = eventData.eventWebsite || event.eventWebsite;

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
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      });

      res.status(200).json({ message: 'Events found successfully', events });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while searching events' });
    }
  },


  filterEvents : async (req, res) =>{
    const {
      searchQuery,
      startDate,
      endDate,
      location,
      category,
    } = req.query;

    try {
      const filter ={};
  
      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }
  
      if (startDate && endDate) {
        filter.time = { $gte: new Date(startDate), $lte: new Date(endDate) };
      } else if (startDate) {
        filter.time = { $gte: new Date(startDate) };
      } else if (endDate) {
        filter.time = { $lte: new Date(endDate) };
      }
  
      if (location) {
        filter.location = location;
      }
  
      if (category) {
        filter.category = category;
      }
  
      const events = await Event.find(filter);
      if(events.length===0){
        res.status(404).json({ message: 'there is no events found with these filters'});
      }
  
      res.status(200).json({ message: 'Events found successfully', events });
    } catch (error) {
      console.error('Error filtering events:', error);
      res.status(500).json({ error: 'Internal Server Error while searching events' });
    }
  },

  joinEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      const userId = req.user.user_id;
      
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (!event.isPublished) {
        return res
        .status(403)
        .json({ error: 'Event has been canceled, you cant join canceled event' });
      }

      if (event.participants.length >= event.maxParticipants) {
        return res
        .status(409)
        .json({ error: 'Event capacity has been reached.' });
      }
      
      const now = new Date();
      if ( now > event.registrationDeadline) {
        return res
        .status(409)
        .json({ error: 'Registration deadline has passed.' });
      }
      
      if (event.participants.includes(userId)) {
        return res
          .status(409)
          .json({ error: 'User is already part of the event' });
      }
      event.participants.push(userId);

      await event.save();
      mailFunctions.sendJoinedEventEmail(req.user.email,event.name, event.time) 
      return res.status(200).json({ message: 'joined successfully' });
      
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal Server Error while joining event' });
    }
  },

  leaveEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      const userId = req.user.user_id;

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if the user is already part of the event
      if (!event.participants.includes(userId)) {
        return res.status(409).json({ error: 'User is not part of the event' });
      }

      // Remove the user's ID from the event's participants array
      await Event.updateOne(
        { _id: eventId },
        { $pull: { participants: userId } }
      );

      await event.save();
      mailFunctions.sendLeftEventEmail(req.user.email,event.name,event.time)
      return res.status(200).json({ message: 'Left the event successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal Server Error while leaving the event' });
    }
  },
};
