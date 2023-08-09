const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const donationRouter = require('./routes/donation');
const blogRouter = require('./routes/blog');
const FERouter = require('./routes/frontend-routes');
const connectToMongo = require('./db');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs")
app.set("views", 'src/views')


app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/donations', donationRouter);
app.use('/blogs', blogRouter);
app.use('/FE', FERouter);

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT || 3000;

const swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description:
      'This is a simple API application made with Express and documented with Swagger',
    license: { name: 'MIT', url: 'https://spdx.org/licenses/MIT.html' },
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {},
  components: {},
  tags: [],
  apis: ['./routes/user.js'],
};

const filePath = path.join(__dirname, './server/swagger.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the Swagger JSON file:', err);
    return;
  }
  try {
    const swaggerDocument = JSON.parse(data);

    Object.assign(swaggerSpec, swaggerDocument);

    app.use(
      '/',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, { explorer: true })
    );
  } catch (parseError) {
    console.error('Error parsing the Swagger JSON data:', parseError);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {app, server};
