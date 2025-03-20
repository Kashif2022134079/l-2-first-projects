import { academicSemesterNameCodeMapper } from './academicSemester.Constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemeter.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester name --> semester code

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllSemester = async () => {
  const result = await AcademicSemester.find();
  return result;
};
const getSingleSemester = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemester,
  getSingleSemester,
};
