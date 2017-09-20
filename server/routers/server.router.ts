import * as express from 'express';
import { router as gameRouter } from './game.router';

const router : express.Router = express.Router();

//... other routers

/*
 * API paths
 */
router.use('/', gameRouter);

//... other paths

router.use('/api', router);

export { router };
