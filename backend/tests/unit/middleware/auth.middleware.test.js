const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../../../middleware/auth.middleware');
const logger = require('../../../utils/logger');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            method: 'GET',
            originalUrl: '/api/protected',
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.spy();

        sinon.stub(logger, 'warn');
        sinon.stub(logger, 'info');
        sinon.stub(logger, 'error');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 401 if no Authorization header is present', () => {
        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(
            res.json.calledWithMatch({ message: 'Authorization token missing' })
        ).to.be.true;
        expect(logger.warn.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 401 if token is invalid', () => {
        req.headers.authorization = 'Bearer invalidtoken';
        sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(
            res.json.calledWithMatch({ message: 'Invalid or expired token' })
        ).to.be.true;
        expect(logger.error.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should call next() and set req.user if token is valid', () => {
        const decoded = { id: 1, email: 'user@example.com', role: 'user' };
        req.headers.authorization = 'Bearer validtoken';
        sinon.stub(jwt, 'verify').returns(decoded);

        authMiddleware(req, res, next);

        expect(req.user).to.deep.equal(decoded);
        expect(logger.info.calledOnce).to.be.true;
        expect(next.calledOnce).to.be.true;
    });
});
