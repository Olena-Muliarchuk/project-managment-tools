const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.BACKEND_PORT || 5000;
const HOST = process.env.SWAGGER_HOST || 'localhost';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project Management API',
            version: '1.0.0',
            description: 'API documentation for the PM Tool',
        },
        servers: [
            { url: '/api' },
            { url: `http://${HOST}:${PORT}/api` },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication' },
            { name: 'Projects', description: 'Project management' },
            { name: 'Tasks', description: 'Task management' },
            { name: 'Users', description: 'User management' },
        ],
    },
    apis: [
        './routes/**/*.js',
        './controllers/**/*.js',
        './api-docs/*.yaml',
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    if (process.env.NODE_ENV === 'development') {
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
};

module.exports = setupSwagger;
