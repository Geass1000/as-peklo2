'use strict';

let express = require('express');
let router = express.Router();

let gameRouter = require('./game.router');
//... other routers

/*
 * API paths
 */
router.use('/', gameRouter);
//... other paths

router.use('/api', router);

module.exports = router;
