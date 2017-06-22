'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var notificationSchema = new Schema({
    priceFrom: Number,
    priceTo: Number,
    priceM2From: Number,
    priceM2To: Number,
    district: String,
    city: String,
    agency: Boolean,
    sizeFrom: Number,
    sizeTo: Number,
    email: { type: String, required: true },
    username: { type: String, required: true },
    active: { type: Boolean, default: true }
});

// Export model
module.exports = mongoose.model('Notification', notificationSchema);
