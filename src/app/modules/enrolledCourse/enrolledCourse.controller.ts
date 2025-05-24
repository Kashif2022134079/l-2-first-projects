import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const user = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    user,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Enrolled Course is created successfully',
    data: result,
  });
});

export const EnrolledCourseController = {
  createEnrolledCourse,
};
