const express = require('express');
require('dotenv').config();
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const session = require('express-session');
const connectToMongo = require('./db');

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

app.use(session(sess));
app.use(express.json());

app.use('/user', userRouter);
app.use('/event', eventRouter);

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
