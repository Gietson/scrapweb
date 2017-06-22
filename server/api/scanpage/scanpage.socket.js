/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ScanPage = require('./scanpage.model');

exports.register = function(socket) {
  //console.log('JESTEM W SCAN PAGE');

  ScanPage.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ScanPage.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  console.log('onsave scanpage = ' + JSON.stringify(doc));
  socket.emit('scanpage:save', doc);

}

function onRemove(socket, doc, cb) {
  console.log('remove');
  socket.emit('scanpage:remove', doc);
}