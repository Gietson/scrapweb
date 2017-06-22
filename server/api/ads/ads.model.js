'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var AdsSchema = new Schema({
    _id: Number,
    title: {type: String, required: true},
    url: {type: String, unique: true, required: true},
    price: Number,
    priceM2: Number,
    dateAdd: {type: Date, default: Date.now},
    district: String,
    city: {type: String, required: true},
    agency: Boolean,
    propertyType: String,
    numberOfRooms: Number,
    numberOfBathrooms: Number,
    size: Number,
    parking: String,
    userName: String,
    phoneNumber: Number,
    photos: [],
    page: String,
    active: {type: Boolean, default: true}
});
AdsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('scrap', AdsSchema);
