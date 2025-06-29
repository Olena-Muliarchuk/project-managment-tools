const sinon = require('sinon');
const { expect } = require('chai');
const logger = require('../../../utils/logger');
const errorHandler = require('../../../middleware/error.middleware');

describe('errorHandler middleware', () => {
    let req;
    let res;
    let statusStub;
    let jsonStub;

    beforeEach(() => {
        req = {
            method: 'GET',
            originalUrl: '/test-url',
        };

        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });

        res = {
            status: statusStub,
        };

        process.env.NODE_ENV = 'test';

        sinon.stub(logger, 'error');
    });

    afterEach(() => {
        sinon.restore();
        delete process.env.NODE_ENV;
    });

    it('should log error and respond with statusCode and message without stack in non-development', () => {
        const error = new Error('Test error');
        error.statusCode = 400;
        error.stack = 'error stack trace';

        errorHandler(error, req, res, () => {});

        expect(logger.error.calledOnce).to.be.true;
        expect(logger.error.calledWith('Test error')).to.be.true;

        expect(statusStub.calledOnceWith(400)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;

        const response = jsonStub.firstCall.args[0];
        expect(response.success).to.be.false;
        expect(response.message).to.equal('Test error');
        expect(response).to.not.have.property('stack');
    });

    it('should include stack in response when NODE_ENV is development', () => {
        process.env.NODE_ENV = 'development';

        const error = new Error('Dev error');
        error.statusCode = 500;
        error.stack = 'dev stack trace';

        errorHandler(error, req, res, () => {});

        expect(logger.error.calledOnce).to.be.true;
        expect(logger.error.calledWith('Dev error')).to.be.true;

        expect(statusStub.calledOnceWith(500)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;

        const response = jsonStub.firstCall.args[0];
        expect(response.success).to.be.false;
        expect(response.message).to.equal('Dev error');
        expect(response).to.have.property('stack', 'dev stack trace');
    });

    it('should use status 500 and default message if none provided', () => {
        const error = new Error();
        delete error.statusCode;
        delete error.message;
        error.stack = 'some stack';

        errorHandler(error, req, res, () => {});

        expect(statusStub.calledOnceWith(500)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal('Internal Server Error');
    });
});
