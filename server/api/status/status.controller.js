'use strict';

var _ = require('lodash');
var Status = require('./status.model');
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

exports.create = function (data, email, blocked, callback) {
    data.email = email;
    data.action = blocked.action;
    data.description = blocked.description;
    data.dateAdd = new Date();
    Status.create(data, function (err, data) {
        if (err) return handleError(err);
        //console.log('dodane do bazy status = ' + status);
        callback(null, data);
    });
};

// Get list of blocked by user
exports.index = function (req, res) {
    console.log('index blocked');
    req.body.email = req.user.email;
    Status.find(req.body, function (err, notes) {
        if (err) return handleError(res, err);
        return res.status(200).json(notes);
    });
};

// Updates an existing coupon in the DB.
exports.update = function(req, res) {
    console.log('update');
    if(req.body._id) { delete req.body._id; }
    //console.log(req.body);
    Status.findById(req.params.id, function (err, coupon) {
        if (err) { return handleError(res, err); }
        if(!coupon) { return res.status(404).send('Not Found'); }
        var updated = _.merge(coupon, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(coupon);
        });
    });
};

// Deletes all status by user
exports.destroyAll = function (req, res) {
    console.log('destroy all');
    req.body.email = req.user.email;
    Status.find({email: req.body.email}, function(err, docs) {
        if (err)return handleError(res, err);
        if (!docs)return res.status(404).send('Not Found');
        //return console.log('no docs found');
        docs.forEach(function (doc) {
            doc.remove(function (err) {
                if (err)return handleError(res, err);
            });
        });
        return res.status(204).send('No Content');
    })};




// Get full list of blocked
exports.getByUser = function (mail, callback) {
    //console.log('getByUser mail = ' + mail);
    Status.find({email: mail}, function (err, block) {
        if (err)return handleError(res, err);
        //console.log('pobralem block=' + JSON.stringify(block));
        callback(block);
    });
};
