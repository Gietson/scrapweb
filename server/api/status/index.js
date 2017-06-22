'use strict';

var express = require('express');
var controller = require('./status.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.post('/', auth.isAuthenticated(), controller.create);
router.get('/', auth.isAuthenticated(), controller.index);
router.put('/:id', controller.update);
router.delete('/', auth.isAuthenticated(), controller.destroyAll);

module.exports = router;
