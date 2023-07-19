const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const connectToMongo = require('./db');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/event', eventRouter);

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
