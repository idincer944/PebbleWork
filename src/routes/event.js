const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get('/getAllEvents', eventController.getAllEvents);
router.get('/createdEvents', authenticate(), eventController.getAllUserEvents);
router.post('/createNewEvent', authenticate(), eventController.createNewEvent);
router.get('/getEventById/:eventId', eventController.getEventById);
router.delete('/deleteEvent/:eventId',authenticate(),eventController.deleteEvent);

router.put('/updateEvent/:eventId', authenticate(), eventController.updateEvent);
router.get('/searchEvents', eventController.searchEvents);


module.exports = router;
