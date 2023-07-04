const express = require('express');
require('dotenv').config();
const connectToMongo = require('./db');
const app = express();

// app.use('/user', authRouter);
// app.use('/event', eventRouter);

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
