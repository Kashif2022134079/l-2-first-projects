import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import status from 'http-status';

const getAllStudents = catchAsync(async (req, res) => {
  // console.log(req.query);
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentFromDB(id, student);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is Updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
