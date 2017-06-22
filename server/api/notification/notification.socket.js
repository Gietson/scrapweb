'use strict';

var auth = require('../../auth/auth.service');
var Notification = require('./notification.model');

exports.register = function(socket) {
  Notification.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Notification.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  var token = socket.handshake.headers.cookie.split("token=%22").pop().split("%22").shift();
  socket.emit('notification:save', doc, token);
}

function onRemove(socket, doc, cb) {
  socket.emit('notification:remove', doc);
}