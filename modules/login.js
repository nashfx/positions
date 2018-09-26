'use strict';
var dotenv = require('dotenv');
dotenv.load();
var config = require('../config');
var express = require('express');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var async = require('async');
var User = require('../models/user');
var app = module.exports = express.Router();

/**
 * LogIn
 * */
app.post('/login', function (req, res) {
    var rolesAccepted = ['admin'];

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ success: false, message: 'Debe ingresar su Email y su Password.' });
    }

    User.findOne({ email: req.body.email.toLowerCase() })
        .populate('role')
        .exec(function(err, user) {
            if (err) {
                res.status(404).json({ success: false, message: err });
            }
            
            // Check if user exist
            if (!user) {
                return res.status(401).json({ success: false, message: 'Email o Contraseña invalida.' });
            } else if (user) {
                // Check User active
                if (!user.active) {
                    return res.status(401).json({ success: false, message: 'Usuario bloqueado.' });
                } else if (!_.includes(rolesAccepted, user.role.name)) {
                    // Check user permission
                    return res.status(401).json({ success: false, message: 'Usuario invalido.' });
                } else {
                    // Check if password matches
                    bcrypt.compare(req.body.password, user.password, function(err, result) {
                        if (!result) {
                            res.status(401).json({ success: false, message: 'Email o Contraseña invalida.' });
                        } else {
                            //user.lastLoginAt = new Date();
                            user.save();

                            var u = user.toObject();
                            u = _.omit(u, 'password');

                            // If user is found and password is right create a token
                            // var token = jwt.sign(u, config.secret, {expiresIn: config.expiresIn});
                            var token = jwt.sign(u, config.secret, {});
                            res.json({token: token, profile: u});
                        }
                    });
                }
            }
        });
});
