const { expect } = require('chai');
const sinon = require('sinon');

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../../../services/task.service');

const { stubPrismaTask, stubPrismaProject, stubPrismaUser } = require('../../mocks/prismaMockHelper');

describe('Task Service', () => {
    afterEach(() => sinon.restore());

    describe('createTask', () => {
        it('should create a task when all data is valid', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves({ id: 1 }) });
            stubPrismaUser({ findUnique: sinon.stub().resolves({ id: 2 }) });
            const taskCreateStub = sinon.stub().resolves({ id: 1, title: 'Task 1' });
            stubPrismaTask({ create: taskCreateStub });

            const result = await createTask({
                title: 'Task 1',
                description: 'Desc',
                projectId: 1,
                assignedToId: 2,
                createdById: 3,
            });

            expect(taskCreateStub.calledOnce).to.be.true;
            expect(result).to.have.property('id', 1);
        });

        it('should throw 400 if projectId is invalid', async () => {
            try {
                await createTask({ projectId: 'invalid' });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal('Invalid projectId');
            }
        });

        it('should throw 404 if project not found', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves(null) });
            try {
                await createTask({ projectId: 1 });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.include('Project with ID 1 not found');
            }
        });

        it('should throw 400 if assignedToId is invalid', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves({ id: 1 }) });
            try {
                await createTask({ projectId: 1, assignedToId: 'abc' });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal('Invalid assignedToId');
            }
        });

        it('should throw 404 if assigned user not found', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves({ id: 1 }) });
            stubPrismaUser({ findUnique: sinon.stub().resolves(null) });
            try {
                await createTask({ projectId: 1, assignedToId: 99 });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.include('User with ID 99 not found');
            }
        });
    });

    describe('getTasks', () => {
        it('should return list of tasks', async () => {
            const tasks = [{ id: 1, title: 'T1' }, { id: 2, title: 'T2' }];
            stubPrismaTask({ findMany: sinon.stub().resolves(tasks) });

            const result = await getTasks();
            expect(result).to.deep.equal(tasks);
        });
    });

    describe('getTaskById', () => {
        it('should return task if found', async () => {
            const task = { id: 1, title: 'Task1' };
            stubPrismaTask({ findUnique: sinon.stub().resolves(task) });

            const result = await getTaskById(1);
            expect(result).to.deep.equal(task);
        });

        it('should throw 404 if task not found', async () => {
            stubPrismaTask({ findUnique: sinon.stub().resolves(null) });
            try {
                await getTaskById(999);
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.include('Task with ID 999 not found');
            }
        });
    });

    describe('updateTask', () => {
        it('should update and return task', async () => {
            const id = 1;
            const updateData = { title: 'Updated' };
            stubPrismaTask({
                findUnique: sinon.stub().resolves({ id }),
                update: sinon.stub().resolves({ id, ...updateData }),
            });
            stubPrismaUser({ findUnique: sinon.stub().resolves({ id: 2 }) });

            const result = await updateTask(id, { ...updateData, assignedToId: 2 });
            expect(result).to.deep.equal({ id, ...updateData });
        });

        it('should throw 404 if task not found', async () => {
            stubPrismaTask({ findUnique: sinon.stub().resolves(null) });
            try {
                await updateTask(999, {});
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
            }
        });

        it('should throw 404 if assigned user not found', async () => {
            stubPrismaTask({ findUnique: sinon.stub().resolves({ id: 1 }) });
            stubPrismaUser({ findUnique: sinon.stub().resolves(null) });
            try {
                await updateTask(1, { assignedToId: 99 });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
            }
        });
    });

    describe('deleteTask', () => {
        it('should delete and return task', async () => {
            const id = 1;
            stubPrismaTask({
                findUnique: sinon.stub().resolves({ id }),
                delete: sinon.stub().resolves({ id }),
            });

            const result = await deleteTask(id);
            expect(result).to.have.property('id', id);
        });

        it('should throw 404 if task not found', async () => {
            stubPrismaTask({ findUnique: sinon.stub().resolves(null) });
            try {
                await deleteTask(999);
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
            }
        });
    });
});
