import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseController } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);
router.get('/:courseId', CourseController.getSingleCourse);
router.patch(
  '/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultyWithCourseValidationSchema),
  CourseController.assignFacultyWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultyWithCourseValidationSchema),
  CourseController.removeFacultyWithCourse,
);
router.delete('/:courseId', CourseController.deleteCourse);

export const CourseRoute = router;
