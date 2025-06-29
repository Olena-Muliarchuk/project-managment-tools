const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { expect } = require('chai');

describe('httpLogger utility', () => {
    let morganStub;
    let httpLogger;

    beforeEach(() => {
        morganStub = sinon.stub();
        morganStub.withArgs('dev').returns(() => 'dev-logger');
        morganStub.withArgs('combined').returns(() => 'combined-logger');
        morganStub.withArgs('tiny').returns(() => 'tiny-logger');

        httpLogger = proxyquire('../../../utils/httpLogger', {
            morgan: morganStub,
        });
    });

    it('should return dev logger in development', () => {
        const logger = httpLogger('development');
        expect(logger()).to.equal('dev-logger');
    });

    it('should return combined logger in production', () => {
        const logger = httpLogger('production');
        expect(logger()).to.equal('combined-logger');
    });

    it('should return tiny logger by default', () => {
        const logger = httpLogger('test');
        expect(logger()).to.equal('tiny-logger');
    });
});
