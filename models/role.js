var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Role', new Schema({
    name: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}));