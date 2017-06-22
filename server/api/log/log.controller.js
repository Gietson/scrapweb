'use strict';

var _ = require('lodash');
var Log = require('./log.model');

function isJson(str) {
    try {
        str = JSON.parse(str);
    } catch (e) {
        str = str;
    }
    return str
}
var fs = require('fs');

// Get list of Logs by user
exports.index = function (req, res) {

    console.log('index log');

    Log.find({}).limit(100).exec(function (err, notes) {
        if (err) {
            return handleError(res, err);
        }
        //console.log(notes);
        return res.status(200).json(notes);
    });
};


// Get a single Notification
exports.show = function (req, res) {
    console.log('show');
    /*Notification.findById(req.params.id, function (err, coupon) {
     if(err) { return handleError(res, err); }
     if(!coupon) { return res.status(404).send('Not Found'); }
     return res.json(coupon);
     });*/
};

// Creates a new coupon in the DB.
exports.create = function (req, res) {
    console.log('create logs');
    req.body.date = new Date();
    Log.create(req.body, function (err, coupon) {
        //console.log(coupon);
        if (err) {
            console.log(err);
            return handleError(res, err);
        }
        return res.status(201).json(coupon);
    });
    /*req.body.username = req.user.name;
     req.body.email = req.user.email;
     //console.log(req.body);
     Notification.create(req.body, function(err, coupon) {
     if(err) { console.log(err);
     return handleError(res, err); }
     return res.status(201).json(coupon);
     });*/
};

// Updates an existing coupon in the DB.
exports.update = function (req, res) {
    console.log('update');
    //console.log(req.body);
    /*
     req.body.id= '57572d601b178af411b04e3e';
     req.body.message = "dupa dupa";
     req.body.level = "error";

     Log.findById(req.params.id, function (err, coupon) {
     console.log(coupon);
     if (err) { return handleError(res, err); }
     if(!coupon) { return res.status(404).send('Not Found'); }
     var updated = _.merge(coupon, req.body);
     console.log('updated');
     console.log(updated);
     updated.save(function (err) {
     if (err) { return handleError(res, err); }
     return res.status(200).json(coupon);
     });
     });*/
};

// Deletes a coupon from the DB.
exports.destroy = function (req, res) {
    console.log('destroy');
    Log.findById(req.params.id, function (err, coupon) {
        if (err) {
            return handleError(res, err);
        }
        if (!coupon) {
            return res.status(404).send('Not Found');
        }
        coupon.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

// Deletes all logs
exports.destroyAll = function (req, res) {
    console.log('destroy all');

    Log.find(function (err, docs) {
        if (err) {
            return handleError(res, err);
        }
        if (!docs) {
            return res.status(404).send('Not Found');
        }
        //return console.log('no docs found');
        docs.forEach(function (doc) {
            doc.remove(function (err) {
                if (err) {
                    return handleError(res, err);
                }
            });
        });
        return res.status(204).send('No Content');
    });

    /* Log.find(function (err, coupon) {
     if(err) { return handleError(res, err); }
     if(!coupon) { return res.status(404).send('Not Found'); }
     Log.remove(function(err) {
     if(err) { return handleError(res, err); }
     return res.status(204).send('No Content');
     });
     });*/
    /*Log.remove(function(err) {
     if(err) { return handleError(res, err); }
     return res.status(204).send('No Content');
     });*/
    /*
     Log.find({},function(err, post) {
     post.remove(function(err) {
     if(err) { return handleError(res, err); }
     return res.status(204).send('No Content');
     });
     });*/
    /*
     Log.remove({}, function(err) {
     if(err) { return handleError(res, err); }
     return res.status(204).send('No Content');
     });*/

};

function handleError(res, err) {
    console.log('[handleError] err=' + err);
    return res.status(500).send(err);
}