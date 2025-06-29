const sinon = require('sinon');

function stubPrismaUser(methods = {}) {
    const userStubs = {
        findUnique: sinon.stub(),
        create: sinon.stub(),
        ...methods,
    };
    sinon.stub(require('../../lib/prisma'), 'user').value(userStubs);
    return userStubs;
}

function stubPrismaProject(methods = {}) {
    const projectStubs = {
        findUnique: sinon.stub(),
        findMany: sinon.stub(),
        create: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
        ...methods,
    };
    sinon.stub(require('../../lib/prisma'), 'project').value(projectStubs);
    return projectStubs;
}

function stubPrismaTask(methods = {}) {
    const taskStubs = {
        findUnique: sinon.stub(),
        findMany: sinon.stub(),
        create: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
        ...methods,
    };
    sinon.stub(require('../../lib/prisma'), 'task').value(taskStubs);
    return taskStubs;
}

module.exports = {
    stubPrismaUser,
    stubPrismaProject,
    stubPrismaTask,
};
