import jwt from "express-jwt";
import config from "../config.js";

var secret = config.APP_SECRET;

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

var auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader,
        algorithms: ['sha1', 'RS256', 'HS256'],
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
};
export default auth;
