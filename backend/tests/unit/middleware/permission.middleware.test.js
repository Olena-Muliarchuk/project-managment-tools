const { expect } = require('chai');
const sinon = require('sinon');

const logger = require('../../../utils/logger');
const {
    canCreateProject,
    canAccessProject,
    canAccessTask,
    canCreateTask,
} = require('../../../middleware/permission.middleware');

const {
    stubPrismaProject,
    stubPrismaTask,
} = require('../../mocks/prismaMockHelper');

const sampleUsers = require('../../mocks/sampleUsers');

describe('Permission Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: sampleUsers.manager,
            params: {},
            body: {},
            method: 'GET',
            originalUrl: '/test',
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();

        sinon.stub(logger, 'warn');
        sinon.stub(logger, 'error');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('canCreateProject', () => {
        it('should call next if user is manager', () => {
            req.user = sampleUsers.manager;

            canCreateProject(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
            expect(logger.warn.called).to.be.false;
        });

        it('should return 403 if user is not manager', () => {
            req.user = sampleUsers.validUser;

            canCreateProject(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });
    });

    describe('canAccessProject', () => {
        it('should return 400 if projectId is invalid', async () => {
            req.params.id = 'abc';

            await canAccessProject(req, res, next);

            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if role is not manager', async () => {
            req.params.id = '1';
            req.user = sampleUsers.validUser;

            await canAccessProject(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 404 if project not found', async () => {
            req.params.id = '1';
            req.user = sampleUsers.manager;

            stubPrismaProject({
                findUnique: sinon.stub().resolves(null),
            });

            await canAccessProject(req, res, next);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if manager tries to access foreign project', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.manager, id: 2 };

            stubPrismaProject({
                findUnique: sinon.stub().resolves({ id: 1, ownerId: 3 }),
            });

            await canAccessProject(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should call next if manager owns project', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.manager, id: 3 };

            stubPrismaProject({
                findUnique: sinon.stub().resolves({ id: 1, ownerId: 3 }),
            });

            await canAccessProject(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
            expect(logger.warn.called).to.be.false;
        });

        it('should call next and log error on exception', async () => {
            req.params.id = '1';
            req.user = sampleUsers.manager;

            stubPrismaProject({
                findUnique: sinon.stub().throws(new Error('DB failure')),
            });

            await canAccessProject(req, res, next);

            expect(logger.error.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('canAccessTask', () => {
        it('should return 400 if invalid task id', async () => {
            req.params.id = 'abc';

            await canAccessTask(req, res, next);

            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if role is unknown', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.validUser, role: 'guest' };

            await canAccessTask(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 404 if task not found', async () => {
            req.params.id = '1';
            req.user = sampleUsers.manager;

            stubPrismaTask({
                findUnique: sinon.stub().resolves(null),
            });

            await canAccessTask(req, res, next);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if manager tries to access task in foreign project', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.manager, id: 1 };

            stubPrismaTask({
                findUnique: sinon.stub().resolves({
                    id: 1,
                    project: { ownerId: 2 },
                }),
            });

            await canAccessTask(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should call next if manager owns project', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.manager, id: 2 };

            stubPrismaTask({
                findUnique: sinon.stub().resolves({
                    id: 1,
                    project: { ownerId: 2 },
                }),
            });

            await canAccessTask(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });

        it('should return 403 if developer tries to access not assigned task', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.validUser, role: 'developer', id: 1 };

            stubPrismaTask({
                findUnique: sinon.stub().resolves({
                    id: 1,
                    assignedToId: 2,
                    project: { ownerId: 1 },
                }),
            });

            await canAccessTask(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should call next if developer accesses own task', async () => {
            req.params.id = '1';
            req.user = { ...sampleUsers.validUser, role: 'developer', id: 2 };

            stubPrismaTask({
                findUnique: sinon.stub().resolves({
                    id: 1,
                    assignedToId: 2,
                    project: { ownerId: 1 },
                }),
            });

            await canAccessTask(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });

        it('should call next and log error on exception', async () => {
            req.params.id = '1';
            req.user = sampleUsers.manager;

            stubPrismaTask({
                findUnique: sinon.stub().throws(new Error('DB failure')),
            });

            await canAccessTask(req, res, next);

            expect(logger.error.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('canCreateTask', () => {
        it('should return 400 if invalid projectId', async () => {
            req.body.projectId = 'abc';

            await canCreateTask(req, res, next);

            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if developer tries to create task', async () => {
            req.user = { ...sampleUsers.validUser, role: 'developer', id: 1 };
            req.body.projectId = '1';

            await canCreateTask(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 404 if project not found', async () => {
            req.user = sampleUsers.manager;
            req.body.projectId = '1';

            stubPrismaProject({
                findUnique: sinon.stub().resolves(null),
            });

            await canCreateTask(req, res, next);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 403 if manager tries to create task in foreign project', async () => {
            req.user = { ...sampleUsers.manager, id: 2 };
            req.body.projectId = '1';

            stubPrismaProject({
                findUnique: sinon.stub().resolves({ id: 1, ownerId: 3 }),
            });

            await canCreateTask(req, res, next);

            expect(res.status.calledOnceWith(403)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(logger.warn.calledOnce).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should call next if manager owns project', async () => {
            req.user = { ...sampleUsers.manager, id: 3 };
            req.body.projectId = '1';

            stubPrismaProject({
                findUnique: sinon.stub().resolves({ id: 1, ownerId: 3 }),
            });

            await canCreateTask(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });

        it('should call next and log error on exception', async () => {
            req.user = { ...sampleUsers.manager, id: 3 };
            req.body.projectId = '1';

            stubPrismaProject({
                findUnique: sinon.stub().throws(new Error('DB failure')),
            });

            await canCreateTask(req, res, next);

            expect(logger.error.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });
});
