//var scrapCtrl = require('./controllers/scrapController');
//var notificationCtrl = require('./controllers/notificationController');
//var pageCtrl = require('./controllers/pageController');
//var logCtrl = require('./controllers/logController');

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function (app) {
    app.use('/api/users', require('./api/user'));
    app.use('/api/ads', require('./api/ads'));
    app.use('/api/notification', require('./api/notification'));
    app.use('/api/scanpage', require('./api/scanpage'));
    app.use('/api/log', require('./api/log'));
    app.use('/api/blocked', require('./api/blocked'));
    app.use('/api/setting', require('./api/setting'));
    app.use('/api/status', require('./api/status'));

    app.use('/auth', require('./auth'));
      
     // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};