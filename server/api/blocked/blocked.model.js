'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlockedSchema = new Schema({
    title: String,
    url: String,
    price: Number,
    priceM2: Number,
    district: String,
    city: String,
    agency: Boolean,
    size: Number,
    parking: String,
    userName: String,
    phoneNumber: Number,
    page: String,
    email: { type: String, required: true },
    active: {type: Boolean, default: true}
});


module.exports = mongoose.model('block', BlockedSchema);
