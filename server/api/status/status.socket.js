'use strict';

var Status = require('./status.model');

exports.register = function(socket) {
  Status.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Status.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  var token = socket.handshake.headers.cookie.split("token=%22").pop().split("%22").shift();
  socket.emit('status:save', doc, token);
}

function onRemove(socket, doc, cb) {
  socket.emit('status:remove', doc);
}