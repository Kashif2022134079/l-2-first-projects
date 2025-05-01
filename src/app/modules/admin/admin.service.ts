import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';

const getAllAdminsFromDB = async () => {
  const result = await Admin.find();
  return result;
};
const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminFromDB = async (id: string, payLoad: Partial<TAdmin>) => {
  const { name, ...remainingStudentData } = payLoad;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findOneAndUpdate(
    { _id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminFromDB,
};
