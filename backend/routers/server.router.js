'use strict';

let express = require('express');
let router = express.Router();

let accountRouter = require('./account.router');
//... other routers

/*
 * API paths
 */
router.use('/', accountRouter);
//... other paths

router.use('/api', router);

module.exports = router;
