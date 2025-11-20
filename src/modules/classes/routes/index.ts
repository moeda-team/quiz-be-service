import { Router } from 'express';
import classRouter from './class.routes';

const router = Router();

router.use('/', classRouter);

export default router;
