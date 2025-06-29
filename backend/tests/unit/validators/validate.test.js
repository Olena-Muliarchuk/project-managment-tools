const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Validation middleware', () => {
    let req, res, next;
    let validationResultStub;
    let validate;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.spy();

        validationResultStub = sinon.stub();

        validate = proxyquire('../../../validators/validate', {
            'express-validator': {
                validationResult: validationResultStub,
            },
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call next() if there are no validation errors', () => {
        validationResultStub.returns({ isEmpty: () => true });

        validate(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('should return 400 and error message if validation errors exist', () => {
        const errorsArray = [
            { param: 'email', msg: 'Invalid email address' },
            { param: 'password', msg: 'Password too short' },
        ];

        validationResultStub.returns({
            isEmpty: () => false,
            array: () => errorsArray,
        });

        validate(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const response = res.json.firstCall.args[0];
        expect(response.success).to.be.false;
        expect(response.message).to.equal('Validation error');
        expect(response.errors).to.deep.equal([
            { field: 'email', message: 'Invalid email address' },
            { field: 'password', message: 'Password too short' },
        ]);
    });
});
