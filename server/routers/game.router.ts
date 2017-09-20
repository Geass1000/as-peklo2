import * as express from 'express';
import * as jwt from 'express-jwt';

import { config } from '../config/app.config';

import { gameController } from '../controllers/game.controller';


const jwtCheck : jwt.RequestHandler = jwt({
  secret : config.crypto.secret
});

const router : express.Router = express.Router();

//... Project
router.route('/account').post(gameController.postSignin.bind(gameController));
router.route('/info').post(jwtCheck, gameController.postGetInfo.bind(gameController));
router.route('/armory').post(jwtCheck, gameController.postGetArmory.bind(gameController));

//... other paths

//... Root path
router.use('/game', router);

export { router };
