import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is retrived successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is retrived successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminFromDB(adminId, admin);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
};
