'use strict';

let express = require('express');
let router = express.Router();

let GameController = require('../controllers/game.controller');
//... other controllers

let config = require('../config/app.config');

let jwt = require('express-jwt');
let jwtCheck = jwt({
  secret: config.secret
});

//... Project
router.route('/account').post(GameController.postSignin.bind(GameController));
router.route('/info').post(jwtCheck, GameController.postGetInfo.bind(GameController));

//... other paths

//... Root path
router.use('/game', router);

module.exports = router;
