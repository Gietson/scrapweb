/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Log = require('./log.model');

exports.register = function(socket) {



    Log.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
    Log.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });



    socket.on('log', function (log) {
        console.log('dostalem loga=', JSON.stringify(log));
        socket.emit('log:save', log);
    });
}

function onSave(socket, doc, cb) {
    console.log('save poszlo = ' + JSON.stringify(doc));
    socket.emit('log:save', doc);
}

function onRemove(socket, doc, cb) {
    console.log('remove poszlo');
    socket.emit('log:remove', doc);
}