const request = require('supertest');
const app = require('../../app');
const { expect } = require('chai');
const { clearDatabase } = require('../utils/test-helpers');

describe('Auth integration tests', () => {
    let refreshToken;
    let accessToken;
    const testEmail = 'auth@test.com';
    const testPassword = 'testpass123';

    before(async () => {
        await clearDatabase();
    });

    after(async () => {
        await clearDatabase();
    });

    it('POST /api/auth/register — should register user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: testEmail,
            password: testPassword,
            role: 'developer',
        });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('success', true);
        expect(res.body.user).to.include({
            email: testEmail,
            role: 'developer',
        });
    });

    it('POST /api/auth/login — should return tokens', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: testEmail,
            password: testPassword,
        });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('accessToken');
        expect(res.body).to.have.property('refreshToken');
        expect(res.body.user).to.include({ email: testEmail });

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it('POST /api/auth/refresh — should return new tokens', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('accessToken');
        expect(res.body).to.have.property('refreshToken');
        expect(res.body.user).to.include({ email: testEmail });
    });

    it('POST /api/auth/logout — should invalidate refresh token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .send({ refreshToken });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body.message).to.match(/logged out/i);
    });

    it('POST /api/auth/refresh — should fail with invalid refresh token', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken }); // this is already invalid after logout

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
    });
});
