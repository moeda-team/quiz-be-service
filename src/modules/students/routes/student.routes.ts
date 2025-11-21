import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { HealthController } from '../controllers/health.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';

const router = Router();
const studentController = new StudentController();
const healthController = new HealthController();

router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), studentController.getAllStudents);
router.get('/:id', jwtAuth, roleAuth(UserRole.TEACHER), studentController.getUserById);

export default router;
