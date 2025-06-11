const express = require('express');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const helmet = require('helmet'); // https://www.npmjs.com/package/helmet
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const notFound = require('./middleware/notFound.middleware');
const logger = require('./utils/logger');
const { nodeEnv } = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(logger(nodeEnv));

// Routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
