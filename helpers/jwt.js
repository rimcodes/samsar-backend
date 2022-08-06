const expressJwt = require('express-jwt');

function authJwt() {
    let secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url:/\/dist/},
            {url:/\/dist\/assets(.*)/, method: ['GET', 'OPTIONS']},
            {url:/\/(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/public\/uploads\/images(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/properties(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/properties\/users(.*)/, method: ['POST', 'OPTIONS']},
            {url: /\/api\/v1\/demand(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/demand\/users(.*)/, method: ['POST', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/posts(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/topics(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/mogatas(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/wilayas(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/comments(.*)/},
            `${api}/users/login`,
            // `${api}/users/register`
            // { url: /(.*)/ }
        ]
    });

    async function isRevoked(req, payload, done) {
        if(!payload.isAdmin) {
            done(null, true);
        };

        done();
    };
};

module.exports = authJwt;