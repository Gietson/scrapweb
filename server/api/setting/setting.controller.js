'use strict';

var _ = require('lodash');
var Setting = require('./setting.model');

function isJson(str) {
    try {
        str = JSON.parse(str);
    } catch (e) {
        str = str;
    }
    return str
}


// Get list of ScanPage
exports.index = function(req, res) {
    console.log('index scanpage');
    Setting.find({}, function (err, pages) {
        if(err) {return handleError(res, err); }
        return res.status(200).json(pages);
    });
};


// Get a single Notification
exports.show = function(req, res) {
    console.log('show');
    Setting.findById(req.params.id, function (err, coupon) {
        if(err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        return res.json(coupon);
    });
};

// Creates a new coupon in the DB.
exports.create = function(req, res) {
    console.log('create');

    req.body.email = req.user.email;
    console.log(req.body);
    Setting.create(req.body, function(err, coupon) {
        if(err) { console.log(err);
            return handleError(res, err); }
        return res.status(201).json(coupon);
    });
};

// Updates an existing coupon in the DB.
exports.update = function(req, res) {
    console.log('update scan');
    req.body.email = req.user.email;
    if(req.body._id) { delete req.body._id; }
    //console.log(req.body);
    Setting.findById(req.params.id, function (err, coupon) {
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
    Setting.findById(req.params.id, function (err, coupon) {
        if(err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        coupon.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    console.log('[handleError] err=' + err);
    return res.status(500).send(err);
}