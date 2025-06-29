const { expect } = require('chai');
const sinon = require('sinon');

const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} = require('../../../services/project.service');

const { stubPrismaProject } = require('../../mocks/prismaMockHelper');

describe('Project Service', () => {
    afterEach(() => sinon.restore());

    describe('getProject', () => {
        it('should return project if found', async () => {
            const fakeProject = { id: 1, title: 'Test Project' };
            stubPrismaProject({
                findUnique: sinon.stub().resolves(fakeProject),
            });

            const result = await getProject(1);
            expect(result).to.deep.equal(fakeProject);
        });

        it('should throw 404 if project not found', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves(null) });

            try {
                await getProject(999);
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err).to.have.property('statusCode', 404);
                expect(err.message).to.include('not found');
            }
        });
    });

    describe('createProject', () => {
        it('should create and return project', async () => {
            const input = {
                title: 'New Project',
                description: 'desc',
                ownerId: 1,
            };
            const createdProject = { id: 1, ...input };
            stubPrismaProject({
                create: sinon.stub().resolves(createdProject),
            });

            const result = await createProject(input);
            expect(result).to.deep.equal(createdProject);
        });
    });

    describe('getProjects', () => {
        it('should return list of projects', async () => {
            const projects = [
                { id: 1, title: 'Proj1', owner: {}, tasks: [] },
                { id: 2, title: 'Proj2', owner: {}, tasks: [] },
            ];
            stubPrismaProject({ findMany: sinon.stub().resolves(projects) });

            const result = await getProjects();
            expect(result).to.deep.equal(projects);
        });
    });

    describe('updateProject', () => {
        it('should update and return project', async () => {
            const id = 1;
            const updateData = { title: 'Updated Title' };
            const existingProject = { id, title: 'Old Title' };
            const updatedProject = { id, ...updateData };

            stubPrismaProject({
                findUnique: sinon.stub().resolves(existingProject),
                update: sinon.stub().resolves(updatedProject),
            });

            const result = await updateProject(id, updateData);
            expect(result).to.deep.equal(updatedProject);
        });

        it('should throw 404 if project not found for update', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves(null) });

            try {
                await updateProject(999, { title: 'New' });
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
            }
        });
    });

    describe('deleteProject', () => {
        it('should delete and return project', async () => {
            const id = 1;
            const existingProject = { id, title: 'To delete' };
            stubPrismaProject({
                findUnique: sinon.stub().resolves(existingProject),
                delete: sinon.stub().resolves(existingProject),
            });

            const result = await deleteProject(id);
            expect(result).to.deep.equal(existingProject);
        });

        it('should throw 404 if project not found for delete', async () => {
            stubPrismaProject({ findUnique: sinon.stub().resolves(null) });

            try {
                await deleteProject(999);
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.statusCode).to.equal(404);
            }
        });
    });
});
