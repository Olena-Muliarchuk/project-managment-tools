const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

const request = require('supertest');
const app = require('../../app');
const { expect } = require('chai');

it('should return 200 on /api/ping', async function () {
    const res = await request(app).get('/api/ping');
    expect(res.status).to.equal(200);
});
