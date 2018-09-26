'use strict';
var dotenv = require('dotenv');
dotenv.load();
var config = require('../config');

module.exports = {
    checkAdminPermission: function(roleId) {
        return config.adminRId === roleId;
    }
};