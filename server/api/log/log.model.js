'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var logSchema = new Schema({
    date: Date,
    level: String,
    message: String
});

logSchema.pre('save', function (next) {
    console.log(next);
    console.log(this.label);

    //if ('invalid' == this.name) return next(new Error('#sadpanda'));
    next();
});

// Export model
module.exports = mongoose.model('Log', logSchema);
