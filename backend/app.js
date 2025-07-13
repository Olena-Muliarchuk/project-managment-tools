const express = require('express');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const helmet = require('helmet'); // https://www.npmjs.com/package/helmet
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const notFound = require('./middleware/notFound.middleware');
const httpLogger = require('./utils/httpLogger');
const { nodeEnv } = require('./config');
const setupSwagger = require('./config/swagger');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // IP limit
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(httpLogger(nodeEnv));

// Routes
app.use('/api', routes);

// Swagger Docs
setupSwagger(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
