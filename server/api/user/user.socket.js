/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var User = require('./user.model');

exports.register = function(socket) {
  //console.log('JESTEM W SCAN PAGE');

  User.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  User.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  console.log('emit user')
  socket.emit('user:save', doc);

}

function onRemove(socket, doc, cb) {
  console.log('remove user');
  socket.emit('user:remove', doc);
}