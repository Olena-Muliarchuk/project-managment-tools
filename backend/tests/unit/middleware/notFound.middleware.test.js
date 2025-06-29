const sinon = require('sinon');
const { expect } = require('chai');
const logger = require('../../../utils/logger');
const notFoundHandler = require('../../../middleware/notFound.middleware');

describe('notFoundHandler middleware', () => {
    let req;
    let res;
    let statusStub;
    let jsonStub;

    beforeEach(() => {
        req = {
            method: 'GET',
            originalUrl: '/some/unknown/route',
            ip: '127.0.0.1',
        };

        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });

        res = {
            status: statusStub,
        };

        sinon.stub(logger, 'warn');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should log warning and respond with 404 and error message', () => {
        notFoundHandler(req, res, () => {});

        const expectedMessage = `Route ${req.originalUrl} not found`;

        expect(logger.warn.calledOnce).to.be.true;
        expect(
            logger.warn.calledWith(expectedMessage, {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
            })
        ).to.be.true;

        expect(statusStub.calledOnceWith(404)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;

        const response = jsonStub.firstCall.args[0];
        expect(response).to.deep.equal({
            success: false,
            message: expectedMessage,
        });
    });
});
