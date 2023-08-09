


const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/events', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/events');
        const events = response.data; // Assuming the API returns an array of events

        res.render('events', { events }); // Render the EJS template with the data
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;


