import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourcesFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cources is retrived successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is retrived successfully',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.updateCourseIntoDB(courseId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is updated successfully',
    data: result,
  });
});

const assignFacultyWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultieswithCourseIntoDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'CourseFaculty assigned successfully',
    data: result,
  });
});
const removeFacultyWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'CourseFaculty remove successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultyWithCourse,
  removeFacultyWithCourse,
};
