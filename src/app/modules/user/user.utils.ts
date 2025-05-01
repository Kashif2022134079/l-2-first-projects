import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};
//generated student id
export const generateStudentId = async (payLoad: TAcademicSemester) => {
  // const id = req.params;
  // const existingFaculty = await Faculty.findOne({ id });
  // if (existingFaculty) {
  //   throw new Error(`Faculty with ID ${id} already exists`);
  // }
  let currentID = (0).toString();

  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  const lastStudentYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = payLoad.code;
  const currentYear = payLoad.year;
  // console.log(currentYear);

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentID = lastStudentId.substring(6);
  }
  let incrementId = (Number(currentID) + 1).toString().padStart(4, '0');

  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`;
  return incrementId;
};
const findLastFaculty = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async (): Promise<string> => {
  const lastFacultyId = await findLastFaculty();

  let currentIdNum = 0;

  if (lastFacultyId) {
    const parts = lastFacultyId.split('-'); // 'F-0023' → ['F', '0023']
    currentIdNum = parseInt(parts[1]) || 0;
  }

  const newIdNum = currentIdNum + 1;
  const newFacultyId = `F-${newIdNum.toString().padStart(4, '0')}`;

  return newFacultyId;
};
const findLastAdmin = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminId = async (): Promise<string> => {
  const lastAdminId = await findLastAdmin();

  let currentIdNum = 0;

  if (lastAdminId) {
    const parts = lastAdminId.split('-'); // 'A-0023' → ['A', '0023']
    currentIdNum = parseInt(parts[1]) || 0;
  }

  const newIdNum = currentIdNum + 1;
  const newAdminId = `A-${newIdNum.toString().padStart(4, '0')}`;

  return newAdminId;
};
