'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var scanPageSchema = new Schema({
    url: {type: String, required: true},
    page: {type: String, required: true},
    email: {type: String, required: true},
    active: { type: Boolean, default: true }
});


// Export model
module.exports = mongoose.model('pages', scanPageSchema);
