'use strict';

let express = require('express');
let router = express.Router();

let AccountController = require('../controllers/account.controller');
//... other controllers

let config = require('../config/app.config');

let jwt = require('express-jwt');
let jwtCheck = jwt({
  secret: config.secret
});

//... Project
router.route('/')
			.post(AccountController.postSignin.bind(AccountController));

//... other paths

//... Root path
router.use('/account', router);

module.exports = router;
