const Event = require('../models/event'); // Import the Event model

module.exports=
        { 
        
        likeEvent : async (req, res) => {
        try {
            const { eventId } = req.params;
            const userId = req.user.user_id;

            // Check if the event exists
            const event = await Event.findById(eventId);
            if (!event) {
            return res.status(404).json({ error: 'Event not found' });
            }

            // Check if the user has already liked the event
            if (event.likes.includes(userId)) {
            return res.status(409).json({ error: 'You have already liked this event' });
            }

            // Add the user to the likes array
            event.likes.push(userId);

            // Save the updated event
            await event.save();

            return res.status(200).json({ message: 'Event liked successfully' });
        } catch (error) {
            console.error('Error liking event:', error);
            return res.status(500).json({ error: 'Internal Server Error while liking event' });
        }
        },

}