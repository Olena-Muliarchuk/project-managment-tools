const morgan = require('morgan');

/**
 * @description Returns a configured Morgan middleware based on environment
 * @param {string} env - Application environment ('development', 'production', etc.)
 * @returns {Function} Express middleware function for logging
 */
const httpLogger = (env) => {
    switch (env) {
        case 'development':
            return morgan('dev');
        case 'production':
            return morgan('combined');
        default:
            return morgan('tiny');
    }
};

module.exports = httpLogger;
