/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Pages = require('../api/scanpage/scanpage.model');

User.find(function (err, data) {
  if(data.length < 1){
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, function() {
        console.log('finished populating users');
    });
  }
});
Pages.find(function (err, data) {
  if(data.length < 1){
    Pages.create({
        page : "gumtree",
        url : "http://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/v1c9073l3200008p1",
        email : "admin@admin.com",
        active : true,
      }, {
      page : "olx",
        url : "http://olx.pl/nieruchomosci/mieszkania/sprzedaz/warszawa/",
        email : "admin@admin.com",
        active : true,
    }, function() {
        console.log('finished populating scanpage');
    });
  }
});
