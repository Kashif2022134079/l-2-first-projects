import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.semesterRegistration,
);
router.get(
  '/',
  SemesterRegistrationController.getAllSemesterRegistrationCourses,
);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistrationCourses,
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistrationCourses,
);

export const SemesterRegistrationRoutes = router;
