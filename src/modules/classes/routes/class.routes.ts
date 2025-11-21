import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { HealthController } from '../controllers/health.controller';
import { jwtAuth, roleAuth, basicAuth } from '../../../middlewares';
import { UserRole } from '../../../utils/auth/jwt';
import { validateCreateUser } from '../validators/create.validator';
import { validateUpdateUser } from '../validators/update.validator';
import { validateAssignStudent } from '../validators/student/assign.validator';
import { validateAddCourse } from '../validators/course/create.validator';
import { validateUpdateCourse } from '../validators/course/update.validator';

const router = Router();
const classController = new ClassController();
const healthController = new HealthController();

// CLASS
router.get('/health', basicAuth, healthController.check);
router.get('/', jwtAuth, roleAuth(UserRole.TEACHER), classController.getAllClasses);
router.get('/:id', jwtAuth, roleAuth(UserRole.STUDENT), classController.getClassById);
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

// STUDENT
router.post(
  '/:id/assign-student',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateAssignStudent,
  classController.assignStudent,
);
router.delete(
  '/:id/unassign-student',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  classController.unassignStudent,
);

// COURSE
router.post(
  '/:id/course',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateAddCourse,
  classController.addCourse,
);
router.patch(
  '/:id/course/:course_id',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  validateUpdateCourse,
  classController.updateCourse,
);
router.delete(
  '/:id/course/:course_id',
  jwtAuth,
  roleAuth(UserRole.TEACHER),
  classController.deleteCourse,
);

export default router;
