import status from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemeter.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterResgistrationIntoDB = async (
  payLoad: TSemesterRegistration,
) => {
  const academicSemester = payLoad?.academicSemester;
  // check if there any registred semester is upcoming or onging
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      status.BAD_REQUEST,
      `There is already a semester which is ${isThereAnyUpcomingOrOngoingSemester.status} `,
    );
  }

  // check is the academicSemester is exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      status.NOT_FOUND,
      'Academic semester dose not found in Db',
    );
  }

  //   checking if the semester is already registred or not
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(status.CONFLICT, 'This semester already registred');
  }

  const result = await SemesterRegistration.create(payLoad);
  return result;
};

const getAllSemesterRegistrationCourseFromDB = async (
  query: Record<string, unknown>,
) => {
  const semisterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semisterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationCourseFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payLoad: Partial<TSemesterRegistration>,
) => {
  // check if the requested registred semester is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      status.NOT_FOUND,
      'This semester is not registred or not found',
    );
  }

  // if the semester registration is ended the we do not update anthing
  const currentSemesterStatus = isSemesterRegistrationExists.status;
  const requestedStatus = payLoad?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      status.BAD_REQUEST,
      `There is a semester which is  already ${currentSemesterStatus} `,
    );
  }

  // upcoming --> ongoing --> ended
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `You cannot directly updated ${currentSemesterStatus} to ${requestedStatus} `,
    );
  }
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `You cannot directly updated ${currentSemesterStatus} to ${requestedStatus} `,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payLoad, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterResgistrationService = {
  createSemesterResgistrationIntoDB,
  getAllSemesterRegistrationCourseFromDB,
  getSingleSemesterRegistrationCourseFromDB,
  updateSemesterRegistrationIntoDB,
};
