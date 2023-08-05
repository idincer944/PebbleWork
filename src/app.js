const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const { swaggerDocument } = require('./server/swagger.json'); // Importing the Swagger file
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');

const connectToMongo = require('./db');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/events', eventRouter);

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description:
      'This is a simple API application made with Express and documented with Swagger',
    license: { name: 'MIT', url: 'https://spdx.org/licenses/MIT.html' },
  },
  servers: [{ url: 'http://localhost:3000/api-docs' }],
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
      '/api-docs',
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
