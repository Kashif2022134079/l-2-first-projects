import express from 'express';
import { StudentController } from './student.crontoller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

// will call controller func
router.get('/', StudentController.getAllStudents);

router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.get('/:studentId', StudentController.getSingleStudent);

router.delete('/:studentId', StudentController.deleteStudent);
export const StudentRoutes = router;
