'use strict';
var dotenv = require('dotenv');
dotenv.load();
var config = require('../config');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var express = require('express');
var User = require('../models/user');
var Role = require('../models/role');
var Permissions = require('../helpers/permissions');
var app = module.exports = express.Router();

var routePrefix = '/user';

/**
 * Get Users list
 * */
app.get(routePrefix, function (req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    var query = {};

    // Sort options
    var sort = '';
    if (req.query.sort) {
        sort = req.query.sort;
    }

    // Pagination options
    var options = {
        sort: sort,
        populate: 'role',
        lean: true,
        offset: req.query.offset ? Number.parseInt(req.query.offset) : 0,
        limit: req.query.limit ? Number.parseInt(req.query.limit) : 10
    };

    User.paginate(query, options).then(function(users) {
        res.status(200).json(users);
    });
});

/**
 * Create a new user
 * */
app.post(routePrefix, function (req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).send('Completa todos los campos');
    }

    User
        .find({email: req.body.email})
        .exec(function(err, user) {
            if (err) {
                return console.error(err);
            }

            if (user.length <= 0) {
                bcrypt.hash(req.body.password, config.saltRounds, function(err, hash) {
                    var user = new User();
                    user.name = user.name;
                    user.password = hash;
                    user.email = req.body.email;
                    user.role = req.body.role;
                    user.active = true;
                    user.birthday = req.body.birthday;
                    user.address = req.body.address;
                    user.phone = req.body.phone;
                    user.createdBy = req.decoded._id;
                    user.avatar = "http://138.197.196.64:3004/uploads/people.png";

                    user.save(function (err, user) {
                        if (err) {
                            return console.error(err);
                        }

                        res.status(201).json(_.omit(user, 'password'));
                    });
                });
            } else {
                return res.status(400).json({ success: false, message: 'Ya existe un usuario con ese email.' });
            }
        });
});

/**
 * Get current user
 * */
app.get(routePrefix + '/me', function(req, res) {
    User.find({ _id: req.decoded._id })
        .populate('role')
        .select('-password')
        .exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        res.status(201).json(user);
    });
});

/**
 * Get a user by id
 * */
app.get(routePrefix + '/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }

        res.json(_.omit(user.toObject(), 'password'));
    });
});

/**
 * Update a user
 * */
app.put(routePrefix + '/:user_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.name = user.firstName + ' ' + user.lastName;
        user.email = req.body.email;
        user.role = req.body.role;
        user.nickName = req.body.nickName;
        user.avatar = req.body.avatar;
        user.birthday = req.body.birthday;
        user.gender = req.body.gender;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.about = req.body.about;
        user.position = req.body.position;
        user.updatedBy = req.decoded._id;
        user.updatedAt = new Date();

        // Save the user
        user.save(function(err, user) {
            if (err) {
                res.send(err);
            }

            res.status(200).json(_.omit(user.toObject(), 'password'));
        });

    });
});

/**
 * Delete a User
 * */
app.delete(routePrefix + '/:user_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }

        user.deleted = true;
        user.updatedBy = req.decoded._id;
        user.updatedAt = new Date();

        // Save the user
        user.save(function(err, user) {
            if (err) {
                res.send(err);
            }

            res.status(200).json({ message: 'Successfully deleted' });
        });

    });
});

/**
 * Update User Password
 * */

app.put(routePrefix + '/:user_id/update-password', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }

        bcrypt.hash(req.body.password, config.saltRounds, function(err, hash) {
            user.password = hash;
            user.updatedAt = new Date();

            user.save(function (err, user) {
                if (err) {
                    res.send(err);
                }

                res.status(201).json(_.omit(user, 'password'));
            });
        });
    });
});