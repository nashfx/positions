var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var schema = new mongoose.Schema({
    name: String,
    password: String,
    email: { type: String, lowercase: true, trim: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    active: Boolean,
    deleted: { type: Boolean, default: false },
    avatar: String,
    birthday: Date,
    address: String,
    phone: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', schema);
