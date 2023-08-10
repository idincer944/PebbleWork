


const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/events/search', async (req, res) => {
    try {
        const q = req.query.q;
        console.log("searching for", q);
        
        const response = await axios.get(`http://localhost:3000/events/search?q=${q}`);
        const events = response.data;
        console.log("Number of events:", events.length);

        // res.render('events', { events });

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/events', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/events');
        const events = response.data; 

        res.render('events', { events }); // Render the EJS template with the data
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/events/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const response = await axios.get(`http://localhost:3000/events/${eventId}`);
        const event = response.data; 
        res.render('detail', { event,username:"SAID BARADAI" }); // Render the detail.ejs template with the event data
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/login', async (req, res) => {
    try {
        res.render('login'); 
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', async (req, res) => {
    try {
        res.render('signup'); 
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;


