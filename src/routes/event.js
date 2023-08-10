const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');

const router = express.Router();

const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');

router.get('/search', eventController.searchEvents);
router.get('/filter', eventController.filterEvents);

router.get('/', eventController.getAllEvents);
router.get('/myEvents', authenticate, eventController.getAllUserEvents);
router.post('/', authenticate, eventController.createNewEvent);
router.get('/:eventId', eventController.getEventById);
router.delete('/:eventId', authenticate, eventController.cancelEvent);
router.put('/:eventId', authenticate, eventController.updateEvent);

router.post('/join/:eventId', authenticate, eventController.joinEvent);
router.post('/leave/:eventId', authenticate, eventController.leaveEvent);

// commnets
router.post('/addComment/:eventId', authenticate, commentController.addComment);
router.delete(
  '/deleteComment/:commentId',
  authenticate,
  commentController.deleteComment
);
router.put(
  '/updateComment/:commentId',
  authenticate,
  commentController.updateComment
);

// likes
router.post('/likeEvent/:eventId', authenticate, likeController.likeEvent);
router.delete(
  '/removeLikeEvent/:eventId',
  authenticate,
  likeController.removeLikeEvent
);
module.exports = router;
