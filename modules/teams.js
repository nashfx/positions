'use strict';
var bcrypt = require('bcrypt');
var _ = require('lodash');
var express = require('express');
var Team = require('../models/team');
var app = module.exports = express.Router();
var Permissions = require('../helpers/permissions');

var routePrefix = '/team';

/**
 * Get Teams
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

    Team.paginate(query, options).then(function(teams) {
        res.status(200).json(teams);
    });
});

/**
 * Create a new team
 * */
app.post(routePrefix, function (req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    if (!req.body.name || !req.body.city || !req.body.stadiumName) {
        return res.status(400).send('Completa todos los campos');
    }

    Team
        .find({email: req.body.name})
        .exec(function(err, team) {
            if (err) {
                return console.error(err);
            }

            if (team.length <= 0) {
                var team = new Team();
                team.name = req.body.name;
                team.city = req.body.city;
                team.stadiumName = req.body.stadiumName;
                team.twitter = req.body.twitter;
                team.instagram = req.body.instagram;
                team.createdBy = req.decoded._id;
                team.avatar = "http://api-falabella.blanco-estudio.com/uploads/people.png";

                team.save(function (err, team) {
                    if (err) {
                        return console.error(err);
                    }

                    res.status(201).json(team);
                });
            } else {
                return res.status(400).json({ success: false, message: 'Ya existe ese equipo.' });
            }
        });
});

/**
 * Update team
 * */
app.put(routePrefix + '/:team_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    Team.findById(req.params.team_id, function(err, team) {
        if (err) {
            res.send(err);
        }

        var team = new Team();
        team.name = req.body.name;
        team.city = req.body.city;
        team.stadiumName = req.body.stadiumName;
        team.twitter = req.body.twitter;
        team.instagram = req.body.instagram;
        team.updatedBy = req.decoded._id;
        team.updatedAt = new Date();

        // Save team
        team.save(function(err, team) {
            if (err) {
                res.send(err);
            }

            res.status(200).json(team);
        });

    });
});

/**
 * Delete Team
 * */
app.delete(routePrefix + '/:team_id', function(req, res) {
    if (!Permissions.checkAdminPermission(req.decoded.role._id)) {
        return res.status(401).json({ success: false, message: 'User unauthorized.' });
    }

    Team.findById(req.params.team_id, function(err, team) {
        if (err) {
            res.send(err);
        }

        Team.remove({
            _id: req.params.team_id
        }, function(err, team) {
            if (err) {
                res.send(err);
            }

            res.status(200).json({ message: 'Successfully deleted' });
        });
    });
});