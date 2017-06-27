'use strict';

let express = require('express');
let router = express.Router();

let editorRouter = require('./editor.router');
//... other routers

/*
 * API paths
 */
router.use('/', editorRouter);
//... other paths

router.use('/api', router);

module.exports = router;
