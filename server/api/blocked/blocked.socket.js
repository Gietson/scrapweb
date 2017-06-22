'use strict';

var Blocked = require('./blocked.model');

exports.register = function(socket) {
  Blocked.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Blocked.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  var token = socket.handshake.headers.cookie.split("token=%22").pop().split("%22").shift();
  socket.emit('blocked:save', doc, token);
}

function onRemove(socket, doc, cb) {
  socket.emit('blocked:remove', doc);
}