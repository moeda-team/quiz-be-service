import { Router } from 'express';
import { UserController } from '../controllers/student.controller';
import { HealthController } from '../controllers/health.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';

const router = Router();
const userController = new UserController();
const healthController = new HealthController();

router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), userController.getAllStudents);
router.get('/:id', jwtAuth, roleAuth(UserRole.TEACHER), userController.getUserById);

export default router;
