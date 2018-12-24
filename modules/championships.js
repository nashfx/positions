'use strict';
var bcrypt = require('bcrypt');
var _ = require('lodash');
var express = require('express');
var Championship = require('../models/championship');
var app = module.exports = express.Router();
var Permissions = require('../helpers/permissions');
var routePrefix = '/championship';

/**
 * Get Championships
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
        offset: Number.parseInt(req.query.offset),
        limit: Number.parseInt(req.query.limit)
    };

    Championship.paginate(query, options).then(function(championships) {
        res.status(200).json(championships);
    });
});

/**
 * Get championship by id
 * */
app.get(routePrefix + '/:championship_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }
    
    Championship.findById(req.params.championship_id, function(err, championship) {
        if (err) {
            res.send(err);
        }

        res.json(championship.toObject());
    });
});


/**
 * Create championship
 * */
app.post(routePrefix, function (req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    if (!req.body.name || !req.body.year) {
        return res.status(400).send('Completa todos los campos');
    }

    Championship
        .find({name: req.body.name})
        .exec(function(err, championship) {
            if (err) {
                return console.error(err);
            }

            if (championship.length <= 0) {
                var championship = new Championship();
                championship.name = req.body.name;
                championship.active = true;
                championship.year = req.body.year;
                championship.teams: req.body.teams;
                championship.country = req.body.country;
                championship.type = req.body.championshipType;
                championship.createdBy = req.decoded._id;

                championship.save(function (err, championship) {
                    if (err) {
                        return console.error(err);
                    }

                    res.status(201).json(championship);
                });
            } else {
                return res.status(400).json({ success: false, message: 'Ya existe un campeonato con ese nombre.' });
            }
        });
});


/**
 * Update championship
 * */
app.put(routePrefix + '/:championship_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    Championship.findById(req.params.championship_id, function(err, championship) {
        if (err) {
            res.send(err);
        }

        championship.name = req.body.name;
        championship.active = req.body.active;
        championship.year = req.body.year;
        championship.country = req.body.country;
        championship.teams: req.body.teams;        
        championship.type = req.body.championshipType;
        championship.updatedBy = req.decoded._id;
        championship.updatedAt = new Date();

        // Save championship
        championship.save(function(err, championship) {
            if (err) {
                res.send(err);
            }

            res.status(200).json(championship);
        });

    });
});

/**
 * Delete championship
 * */
app.delete(routePrefix + '/:championship_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    Championship.findById(req.params.championship_id, function(err, championship) {
        if (err) {
            res.send(err);
        }

        championship.deleted = true;
        championship.updatedBy = req.decoded._id;
        championship.updatedAt = new Date();

        // Save the user
        championship.save(function(err, championship) {
            if (err) {
                res.send(err);
            }

            res.status(200).json({ message: 'Successfully deleted' });
        });

    });
});