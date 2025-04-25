import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

const getAllFacultiesFromDB = async () => {
  const result = await Faculty.find();
  return result;
};
const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id);
  return result;
};

const updateFacultyFromDB = async (id: string, payLoad: Partial<TFaculty>) => {
  const { name, ...remainingStudentData } = payLoad;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate(
    { _id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyFromDB,
};
