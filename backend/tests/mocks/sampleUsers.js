// mocks/sampleUsers.js

module.exports = {
    validUser: {
        id: 1,
        email: 'user@example.com',
        password: 'hashed_pw',
        role: 'user',
    },
    manager: {
        id: 2,
        email: 'manager@example.com',
        password: 'hashed_pw',
        role: 'manager',
    },
    jwtFailUser: {
        id: 3,
        email: 'jwtfail@example.com',
        password: 'hashed_pw',
        role: 'user',
    },
};
