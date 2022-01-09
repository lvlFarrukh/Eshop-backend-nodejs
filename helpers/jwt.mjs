import jwt from "express-jwt";

const authJWT = () => {
    const secret = process.env.JSON_WEB_TOKEN;
    const api = process.env.API_URL;
    return jwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: revoked
    }).unless({
        path: [
            {url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTION"]},
            `${api}/user/login`,
            `${api}/user/register`,
        ]
    })
}

const revoked = async (req, payload, done) => {
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

export default authJWT;