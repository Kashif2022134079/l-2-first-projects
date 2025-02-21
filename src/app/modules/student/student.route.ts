import express from 'express';
import { StudentController } from './student.crontoller';

const router = express.Router();

// will call controller func
router.post('/create-student', StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteStudent);
export const StudentRoutes = router;
