const morgan = require('morgan');

const logger = (env) => {
    return env === 'development' ? morgan('dev') : morgan('combined');
};

module.exports = logger;
