'use strict';
var bcrypt = require('bcrypt');
var _ = require('lodash');
var express = require('express');
var Championship = require('../models/championship');
var app = module.exports = express.Router();

var routePrefix = '/championship';

/**
 * Get Championships
 * */
app.get(routePrefix, function (req, res) {
    
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
