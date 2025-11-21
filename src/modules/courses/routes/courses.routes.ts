import { Router } from 'express';
import { CoursesController } from '../controllers/courses.controller';
import { HealthController } from '../controllers/health.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';

const router = Router();
const coursesController = new CoursesController();
const healthController = new HealthController();

router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), coursesController.getAllCourses);
router.get('/:id', jwtAuth, roleAuth(UserRole.TEACHER), coursesController.getCourseById);
router.post('/', jwtAuth, roleAuth(UserRole.TEACHER), coursesController.createCourse);

export default router;
