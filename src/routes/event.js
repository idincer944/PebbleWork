const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const eventController= require('../controllers/eventController')


router.get('/getAllEvents',eventController.getAllEvents)
router.post('/createNewEvent',eventController.createNewEvent)
router.get('/getEventById/:eventId', eventController.getEventById);
router.delete('/deleteEvent/:eventId', eventController.deleteEvent);

/*
router.put('/updateEvent/:eventId', eventController.updateEvent);
router.get('/searchEvents', eventController.searchEvents);
router.get('/getEventsByCategory/:category', eventController.getEventsByCategory);*/

module.exports = router;