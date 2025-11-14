import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { HealthController } from '../controllers/health.controller';
import { AuthController } from '../controllers/auth.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';
import { validateCreateUser } from '../validators/create.validator';
import { validateUpdateUser } from '../validators/update.validator';
import { validateDeleteUser } from '../validators/delete.validator';
import { validateRequestResetPassword } from '../validators/requestResetPassword.validator';
import { validateResetPassword } from '../validators/resetPassword.validator';

const router = Router();
const userController = new UserController();
const healthController = new HealthController();
const authController = new AuthController();

router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), userController.getAllUsers);
router.get('/profile', jwtAuth, roleAuth(UserRole.STUDENT), userController.getUserById);
router.post(
  '/profile/reset/request',
  basicAuth,
  validateRequestResetPassword,
  userController.requestResetPassword,
);
router.patch('/profile/reset', basicAuth, validateResetPassword, userController.resetPassword);
router.post('/sign/in', basicAuth, authController.login);
router.post('/sign/up', basicAuth, validateCreateUser, userController.createUser);
router.patch(
  '/',
  jwtAuth,
  roleAuth(UserRole.STUDENT),
  validateUpdateUser,
  userController.updateUser,
);
router.delete(
  '/',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateDeleteUser,
  userController.deleteUser,
);

export default router;
