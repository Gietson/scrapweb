/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var people = [];
// When the user disconnects.. perform this
function onDisconnect(socket) {
  console.log('onDisconnect');

  people.splice(people.indexOf(socket.id), 1);
  console.info('[%s - %d] DISCONNECTED', socket.address, people.length);

  socket.emit('info', 'exit jest ludzi: ' + people.length);
  socket.broadcast.emit('info', 'exit [brod] jest ludzi: ' + people.length);
}

// When the user connects.. perform this
function onConnect(socket) {
  people.push(socket);
  socket.emit('info', 'jest ludzi: ' + people.length);
  socket.broadcast.emit('info', '[brod] jest ludzi: ' + people.length);
  console.info('[%s - %d] CONNECTED id = %s', socket.address, people.length, socket.id);


  // When the client emits 'info', this listens and executes
  /*socket.on('logs', function (data) {
    console.info('dupa => [%s] %s', socket.address, JSON.stringify(data, null, 2));
  });*/

  // Insert sockets below
  require('../api/notification/notification.socket').register(socket);
  require('../api/scanpage/scanpage.socket').register(socket);
  require('../api/log/log.socket').register(socket);
  require('../api/user/user.socket').register(socket);
  require('../api/blocked/blocked.socket').register(socket);
  require('../api/setting/setting.socket').register(socket);
  require('../api/status/status.socket').register(socket);
  /*
  require('../api/country/country.socket').register(socket);
  require('../api/shipping/shipping.socket').register(socket);
  require('../api/coupon/coupon.socket').register(socket);
  require('../api/feature/feature.socket').register(socket);
  require('../api/PaymentMethod/PaymentMethod.socket').register(socket);
  require('../api/setting/setting.socket').register(socket);
  require('../api/dashboard/dashboard.socket').register(socket);
  require('../api/cart/cart.socket').register(socket);
  require('../api/invoice/invoice.socket').register(socket);
  require('../api/shop/shop.socket').register(socket);
  require('../api/brand/brand.socket').register(socket);
  require('../api/order/order.socket').register(socket);
  require('../api/category/category.socket').register(socket);
  require('../api/product/product.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);*/
}
module.exports = function (socketio) {

  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  /*socketio.use(require('socketio-jwt').authorize({
     secret: config.secrets.session,
     handshake: true
   }));*/

  socketio.on('connection', function (socket) {
    socket.address = socket.request.connection.remoteAddress +
        ':' + socket.request.connection.remotePort;
    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
    });

    // Call onConnect.
    onConnect(socket);
  });

};
