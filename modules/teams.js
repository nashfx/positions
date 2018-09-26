'use strict';
var bcrypt = require('bcrypt');
var _ = require('lodash');
var express = require('express');
var Team = require('../models/team');
var app = module.exports = express.Router();

var routePrefix = '/team';

/**
 * Get Teams
 * */
app.get(routePrefix, function (req, res) {
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

    Team.paginate(query, options).then(function(teams) {
        res.status(200).json(teams);
    });
});
