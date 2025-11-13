import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { HealthController } from '../controllers/health.controller';
import { AuthController } from '../controllers/auth.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';
import { validateCreateUser, validateUpdateUser } from '../validators/user.validator';

const router = Router();
const userController = new UserController();
const healthController = new HealthController();
const authController = new AuthController();

router.get('/health', healthController.check);
router.post('/login', authController.login);
router.get('/:id', jwtAuth, roleAuth(UserRole.STUDENT), userController.getUserById);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), userController.getAllUsers);
router.post('/', basicAuth, validateCreateUser, userController.createUser);
router.put(
  '/:id',
  jwtAuth,
  roleAuth(UserRole.STUDENT),
  validateUpdateUser,
  userController.updateUser,
);
router.delete('/:id', jwtAuth, roleAuth(UserRole.ADMIN), userController.deleteUser);

export default router;
