'use strict';

var _ = require('lodash');
var Notification = require('./notification.model');

function isJson(str) {
    try {
        str = JSON.parse(str);
    } catch (e) {
        str = str;
    }
    return str
}
var fs = require('fs');

// Get list of Notifications by user
exports.index = function(req, res) {
    req.query.email =  req.user.email;
    var q = isJson(req.query);
    Notification.find(q, function (err, notes) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(notes);
    });
};


// Get a single Notification
exports.show = function(req, res) {
    console.log('show');
    Notification.findById(req.params.id, function (err, coupon) {
        if(err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        return res.json(coupon);
    });
};

// Creates a new coupon in the DB.
exports.create = function(req, res) {
    console.log('create');

    req.body.username = req.user.name;
    req.body.email = req.user.email;
    //console.log(req.body);
    Notification.create(req.body, function(err, coupon) {
        if(err) { console.log(err);
            return handleError(res, err); }
        return res.status(201).json(coupon);
    });
};

// Updates an existing coupon in the DB.
exports.update = function(req, res) {
    console.log('update');
    if(req.body._id) { delete req.body._id; }
    //console.log(req.body);
    Notification.findById(req.params.id, function (err, coupon) {
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
    Notification.findById(req.params.id, function (err, coupon) {
        if(err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        coupon.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

exports.getAll = function (callback) {
	Notification.find({}, function (err, doc) {
		if(err) return callback(err);

		if(doc){
			//console.log('doc=' + doc);
			callback(doc);
		}
		else{
			callback(null);
		}
	});
};

function handleError(res, err) {
    return res.status(500).send(err);
}