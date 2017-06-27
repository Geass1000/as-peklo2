'use strict';

let express = require('express');
let router = express.Router();

let ProjectController = require('../controllers/project.controller');
//... other controllers

let config = require('../config/app.config');

let jwt = require('express-jwt');
let jwtCheck = jwt({
  secret: config.secret
});

//... Project
router.route('/project')
			.get(jwtCheck, ProjectController.getProjects.bind(ProjectController))
			.post(jwtCheck, ProjectController.postProject.bind(ProjectController));
router.route('/project/:id')
			.get(jwtCheck, ProjectController.getProject.bind(ProjectController))
			.put(jwtCheck, ProjectController.putProject.bind(ProjectController))
			.delete(jwtCheck, ProjectController.deleteProject.bind(ProjectController));

//... other paths

//... Root path
router.use('/editor', router);

module.exports = router;
