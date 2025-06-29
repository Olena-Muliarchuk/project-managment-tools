const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { register, login } = require('../../../services/auth.service');
const { stubPrismaUser } = require('../../mocks/prismaMockHelper');
const sampleUsers = require('../../mocks/sampleUsers');

describe('Auth Service', () => {
    afterEach(() => sinon.restore());

    describe('register()', () => {
        it('should create a new user if email is not taken', async () => {
            const email = 'user@example.com';
            const password = 'password123';

            const userCreateStub = sinon.stub().resolves(sampleUsers.validUser);
            stubPrismaUser({
                findUnique: sinon.stub().resolves(null),
                create: userCreateStub,
            });
            sinon.stub(bcrypt, 'hash').resolves('hashed_pw');

            const result = await register(email, password);

            expect(result).to.include({ email, role: 'user' });
            expect(userCreateStub.calledOnce).to.be.true;
        });

        it('should throw an error if email already exists', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(sampleUsers.validUser),
            });

            try {
                await register(sampleUsers.validUser.email, '123456');
                throw new Error('Should not reach this');
            } catch (err) {
                expect(err.message).to.equal('User already exists');
                expect(err.statusCode).to.equal(409);
            }
        });

        it('should throw 500 if hashing fails', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(null),
            });

            sinon.stub(bcrypt, 'hash').throws(new Error('Hashing failed'));

            try {
                await register('fail@hash.com', '123456');
            } catch (err) {
                expect(err.message).to.equal('Hashing failed');
                expect(err.statusCode).to.equal(500);
            }
        });
    });

    describe('login()', () => {
        it('should return token and user if credentials are valid', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(sampleUsers.manager),
            });

            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('mocked.jwt.token');

            const result = await login(
                sampleUsers.manager.email,
                'password123'
            );

            expect(result).to.have.property('token');
            expect(result.user).to.deep.equal({
                id: sampleUsers.manager.id,
                email: sampleUsers.manager.email,
                role: sampleUsers.manager.role,
            });
        });

        it('should throw error if user not found', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(null),
            });

            try {
                await login('notfound@example.com', 'pass');
            } catch (err) {
                expect(err.message).to.equal('Invalid email or password');
                expect(err.statusCode).to.equal(401);
            }
        });

        it('should throw error if password does not match', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(sampleUsers.validUser),
            });

            sinon.stub(bcrypt, 'compare').resolves(false);

            try {
                await login(sampleUsers.validUser.email, 'wrongpass');
            } catch (err) {
                expect(err.message).to.equal('Invalid email or password');
                expect(err.statusCode).to.equal(401);
            }
        });

        it('should throw 500 if jwt.sign fails', async () => {
            stubPrismaUser({
                findUnique: sinon.stub().resolves(sampleUsers.jwtFailUser),
            });

            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').throws(new Error('JWT error'));

            try {
                await login(sampleUsers.jwtFailUser.email, 'pass');
            } catch (err) {
                expect(err.message).to.equal('JWT error');
                expect(err.statusCode).to.equal(500);
            }
        });
    });
});
