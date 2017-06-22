'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var settingSchema = new Schema({
    name: {type: String, required: true},
    value: {type: String, required: true},
    email: {type: String, required: true}
});

// Export model
module.exports = mongoose.model('Setting', settingSchema);
