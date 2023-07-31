const express = require('express');
const {authenticate, isAdmin} = require('../middleware/authenticate');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get('/getAllEvents', eventController.getAllEvents);
router.get('/createdEvents', authenticate, eventController.getAllUserEvents);
router.post('/createNewEvent', authenticate, eventController.createNewEvent);
router.get('/getEventById/:eventId', eventController.getEventById);
router.delete('/deleteEvent/:eventId', authenticate, eventController.cancelEvent);
router.put('/updateEvent/:eventId', authenticate, eventController.updateEvent);
router.get('/searchEvents', eventController.searchEvents);
router.get('/filterhEvents', eventController.filterEvents);
router.post('/joinEvent/:eventId', authenticate, eventController.joinEvent);
router.post('/leaveEvent/:eventId', authenticate, eventController.leaveEvent);
module.exports = router;
