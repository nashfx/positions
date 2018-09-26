'use strict';
var dotenv = require('dotenv');
dotenv.load();
var config = require('../config');
var jwt = require('jsonwebtoken');

// Middleware to verify a token
module.exports = function(req, res, next) {
    // Check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Decode token
    if (token) {
        // Verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // If there is no token return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
