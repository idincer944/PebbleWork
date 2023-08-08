require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.NODE_ENV === 'test'
  ? process.env.DB_URL_TEST
  : process.env.DB_URL;

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  db = mongoose.connection;

  db.once('open', () => {
    console.log('Database connected: ', url);
  });

  db.on('error', (err) => {
    console.error('Database connection error: ', err);
  });
};

module.exports = connectToMongo;
