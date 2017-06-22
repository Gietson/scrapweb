'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
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
    email: {type: String, required: true},
    action: {type: String, required: true},
    description: String,
    dateAdd: Date
});


module.exports = mongoose.model('statu', StatusSchema);
