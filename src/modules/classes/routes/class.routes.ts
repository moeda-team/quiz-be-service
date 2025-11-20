import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { HealthController } from '../controllers/health.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';
import { validateCreateUser } from '../validators/create.validator';
import { validateUpdateUser } from '../validators/update.validator';

const router = Router();
const classController = new ClassController();
const healthController = new HealthController();

router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), classController.getAllClasses);
router.get('/:id', jwtAuth, roleAuth(UserRole.TEACHER), classController.getClassById);
router.post(
  '/',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateCreateUser,
  classController.createClass,
);
router.put(
  '/:id',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateUpdateUser,
  classController.updateClass,
);
router.delete('/:id', jwtAuth, roleAuth(UserRole.TEACHER), classController.deleteClass);

export default router;
