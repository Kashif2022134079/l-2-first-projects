import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyController.getAllFaculties);
router.get('/:facultyId', FacultyController.getSingleFaculty);
router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);

export const FacultyRoutes = router;
