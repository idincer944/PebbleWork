const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');

router.get('/getAllEvents', eventController.getAllEvents);
router.get('/createdEvents', authenticate(), eventController.getAllUserEvents);
router.post('/createNewEvent', authenticate(), eventController.createNewEvent);
router.get('/getEventById/:eventId', eventController.getEventById);
router.delete('/deleteEvent/:eventId',authenticate(),eventController.cancleEvent);
router.put('/updateEvent/:eventId',authenticate(),eventController.updateEvent);
router.get('/searchEvents', eventController.searchEvents);
router.get('/filterhEvents', eventController.filterhEvents);
router.post('/joinEvent/:eventId', authenticate(), eventController.joinEvent);
router.post('/leaveEvent/:eventId', authenticate(), eventController.leaveEvent);

//commnets
router.post('/addComment/:eventId',authenticate(),commentController.addComment);
router.delete('/deleteComment/:commentId', authenticate(),commentController.deleteComment);
router.put('/updateComment/:commentId',authenticate(),commentController.updateComment);

//likes
router.post('/likeEvent/:eventId', authenticate(), likeController.likeEvent);
router.delete('/removeLikeEvent/:eventId',authenticate(),likeController.removeLikeEvent
);
module.exports = router;
