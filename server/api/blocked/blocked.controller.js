'use strict';

var _ = require('lodash');
var Blocked = require('./blocked.model');
var async = require('async');

var validationError = function (res, err) {
    return res.status(422).json(err);
};
function isJson(str) {
    try {
        str = JSON.parse(str);
    } catch (e) {
        str = str;
    }
    return str
}

exports.create = function (req, res) {
    req.body.email = req.user.email;
    var q = req.body;
    console.log(JSON.stringify(q));

    Blocked.create(q, function (err, result) {
        if (err) return handleError(err);
        res.status(200).json(result);
    });
};

// Get list of blocked by user
exports.index = function (req, res) {
    console.log('index blocked');
    req.body.email = req.user.email;
    Blocked.find(req.body, function (err, notes) {
        if (err) return handleError(res, err);
        return res.status(200).json(notes);
    });
};

// Updates an existing coupon in the DB.
exports.update = function(req, res) {
    console.log('update');
    if(req.body._id) { delete req.body._id; }
    //console.log(req.body);
    Blocked.findById(req.params.id, function (err, coupon) {
        if (err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        var updated = _.merge(coupon, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(coupon);
        });
    });
};

// Deletes a coupon from the DB.
exports.destroy = function(req, res) {
    console.log('destroy');
    Blocked.findById(req.params.id, function (err, coupon) {
        if(err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        coupon.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};



// Get full list of blocked
exports.getByUser = function (mail, callback) {
    //console.log('getByUser mail = ' + mail);
    Blocked.find({email: mail}, function (err, block) {
        if (err)return handleError(res, err);
        //console.log('pobralem block=' + JSON.stringify(block));
        callback(block);
    });
};
