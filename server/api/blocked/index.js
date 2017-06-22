'use strict';

var express = require('express');
var controller = require('./blocked.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.create);
router.get('/', auth.isAuthenticated(), controller.index);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
