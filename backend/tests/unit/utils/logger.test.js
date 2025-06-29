const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Logger utility', () => {
    let consoleTransportStub, createLoggerStub, loggerMock;
    let originalEnv;

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV;

        consoleTransportStub = sinon.stub();
        createLoggerStub = sinon.stub();

        loggerMock = {
            info: sinon.spy(),
            error: sinon.spy(),
            debug: sinon.spy(),
            log: sinon.spy(),
        };

        createLoggerStub.returns(loggerMock);

        proxyquire('../../../utils/logger', {
            winston: {
                createLogger: createLoggerStub,
                format: {
                    combine: sinon.stub().returns('combined-format'),
                    timestamp: sinon.stub().returns('timestamp'),
                    printf: sinon.stub().returns('printf'),
                },
                transports: {
                    Console: consoleTransportStub,
                },
            },
        });
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        sinon.restore();
    });

    it('should set log level to "debug" in development', () => {
        process.env.NODE_ENV = 'development';
        proxyquire('../../../utils/logger', {
            winston: {
                createLogger: createLoggerStub,
                format: {
                    combine: sinon.stub().returns('combined-format'),
                    timestamp: sinon.stub().returns('timestamp'),
                    printf: sinon.stub().returns('printf'),
                },
                transports: {
                    Console: consoleTransportStub,
                },
            },
        });

        expect(
            createLoggerStub.calledWithMatch({
                level: 'debug',
            })
        ).to.be.true;
    });

    it('should set log level to "info" in production', () => {
        process.env.NODE_ENV = 'production';
        proxyquire('../../../utils/logger', {
            winston: {
                createLogger: createLoggerStub,
                format: {
                    combine: sinon.stub().returns('combined-format'),
                    timestamp: sinon.stub().returns('timestamp'),
                    printf: sinon.stub().returns('printf'),
                },
                transports: {
                    Console: consoleTransportStub,
                },
            },
        });

        expect(
            createLoggerStub.calledWithMatch({
                level: 'info',
            })
        ).to.be.true;
    });
});
