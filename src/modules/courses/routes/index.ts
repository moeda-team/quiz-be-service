import { Router } from 'express';
import coursesRouter from './courses.routes';

const router = Router();

router.use('/', coursesRouter);

export default router;
