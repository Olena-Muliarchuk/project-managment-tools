const request = require('supertest');
const app = require('../../app');
const { clearDatabase, createUserAndLogin } = require('../utils/test-helpers');
const { expect } = require('chai');

describe('User integration tests', () => {
    let token;

    before(async () => {
        await clearDatabase();
        token = await createUserAndLogin(
            'test@test.com',
            'password123',
            'developer'
        );
    });

    after(async () => {
        await clearDatabase();
    });

    it('GET /api/users/me — should return own profile', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', 'test@test.com');
    });
});
