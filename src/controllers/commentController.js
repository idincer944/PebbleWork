const mailFunctions = require('../utils/mailing/mail-functions');
const Comment =require('../models/comment')
const Event =require('../models/event')
const User =require('../models/user')
const {validateComment} = require('../utils/validations');


module.exports={
    addComment : async (req,res)=>{
        try {
          const { eventId } = req.params;
          const userId = req.user.user_id;
          
             const validationResult = validateComment(req.body);

            if (validationResult.error) {
            // Validation failed, handle the error with custom messages
            const errorMessages = validationResult.error.details.map(
                (error) => error.message
            );
            return res.status(400).json({ errors: errorMessages });
            }

            const {content} =validationResult.value
            
          const event = await Event.findById(eventId);
      
          if (!event) {
            return res.status(404).json({ error: 'Event not found' });
          }
      
          if (!event.isPublished) {
            return res.status(403).json({ error: 'Event has been canceled, you can\'t add comments to canceled events' });
          }
      
          // checking if comments are allowed for the event
          if (!event.allowComments) {
            return res.status(403).json({ error: 'Comments are not allowed for this event' });
          }
      
          const comment = new Comment({
            user: userId,
            event: eventId,
            content: content,
          });
      
          await comment.save();

          event.comments.push(comment._id);
          await event.save();  
          //sen notification to the user who created the event
          const user = await User.findById(event.createdBy);
          if (userId !== event.createdBy.toString()) {
         mailFunctions.sendCommentNotificationEmail(req.user.email,user.firstname, event.name, content,event.time);  
          }
          return res.status(200).json({ message: 'Comment added successfully', comment });
        } catch (error) {
          console.error('Error adding comment:', error);
          return res.status(500).json({ error: 'Internal Server Error while adding comment' });
        }
      },
}