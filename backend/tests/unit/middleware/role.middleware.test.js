const { expect } = require('chai');
const sinon = require('sinon');

const { authorizeRoles } = require('../../../middleware/role.middleware');
const logger = require('../../../utils/logger');

describe('authorizeRoles middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: null,
            method: 'GET',
            originalUrl: '/test',
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();

        sinon.stub(logger, 'warn');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 401 if user is not authenticated', () => {
        const middleware = authorizeRoles('manager', 'admin');

        middleware(req, res, next);

        expect(res.status.calledOnceWith(401)).to.be.true;
        expect(res.json.calledOnceWith({ error: 'Not authenticated' })).to.be
            .true;
        expect(logger.warn.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 403 if user role is not allowed', () => {
        req.user = { id: 1, role: 'user' };
        const middleware = authorizeRoles('manager', 'admin');

        middleware(req, res, next);

        expect(res.status.calledOnceWith(403)).to.be.true;
        expect(
            res.json.calledOnceWith({
                error: 'Access denied: insufficient role',
            })
        ).to.be.true;
        expect(logger.warn.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should call next if user role is allowed', () => {
        req.user = { id: 2, role: 'manager' };
        const middleware = authorizeRoles('manager', 'admin');

        middleware(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;
        expect(logger.warn.called).to.be.false;
    });

    it('should allow multiple roles', () => {
        req.user = { id: 3, role: 'admin' };
        const middleware = authorizeRoles('manager', 'admin');

        middleware(req, res, next);

        expect(next.calledOnce).to.be.true;
    });
});
