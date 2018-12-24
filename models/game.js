var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var schema = new mongoose.Schema({
    jornada: String,
    date: String,
    stadiumName: String,
    local: {type: Schema.Types.ObjectId, ref: 'Team' },
    visitor: {type: Schema.Types.ObjectId, ref: 'Team' },
    localGoals: { type: Number, default: 0 },
    visitorGoals: { type: Number, default: 0 },
    localPoints: { type: Number, default: 0 },
    visitorPoints: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Game', schema);