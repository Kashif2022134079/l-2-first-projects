import express from 'express';
import { StudentController } from './student.crontoller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';

const router = express.Router();

// will call controller func
router.get('/', StudentController.getAllStudents);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.get(
  '/:id',
  auth('admin', 'faculty'),
  StudentController.getSingleStudent,
);

router.delete('/:id', StudentController.deleteStudent);
export const StudentRoutes = router;
