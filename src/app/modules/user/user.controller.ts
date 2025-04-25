import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import status from 'http-status';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
};
