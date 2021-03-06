var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var schema = new mongoose.Schema({
    name: String,
    active: Boolean,
    year: String,
    country: String,
    type: String,
    teams: [{ type : Schema.ObjectId , ref: 'Team' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Championship', schema);
