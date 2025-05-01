import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchAbleArray } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, courseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCourseIntoDB = async (payLoad: TCourse) => {
  const result = await Course.create(payLoad);
  return result;
};
const getAllCourcesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisieteCourses.course'),
    query,
  )
    .search(CourseSearchAbleArray)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisieteCourses.course',
  );
  return result;
};
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payLoad: Partial<TCourse>) => {
  const { preRequisieteCourses, ...courseRemaningData } = payLoad;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // step-1 -> basic course info updated
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemaningData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(status.BAD_REQUEST, 'Failed to update Course');
    }

    if (preRequisieteCourses && preRequisieteCourses.length > 0) {
      // filter out the deleted field
      const deletedPrerequisite = preRequisieteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedPrerequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisieteCourses: { course: { $in: deletedPrerequisite } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPrerequisiteCourses) {
        throw new AppError(status.BAD_REQUEST, 'Failed to update Course');
      }
      // filterOut the new courseField
      const newPreRequisites = preRequisieteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisieteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(status.BAD_REQUEST, 'Failed to update course');
      }
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisieteCourses.course',
    );

    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, 'Failed to update course');
  }
};

const assignFacultieswithCourseIntoDB = async (
  id: string,
  payLoad: Partial<TCourseFaculty>,
) => {
  const result = await courseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payLoad } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};
const removeFacultiesFromCourseFromDB = async (
  id: string,
  payLoad: Partial<TCourseFaculty>,
) => {
  const result = await courseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payLoad } },
    },
    {
      new: true,
    },
  );
  return result;
};
export const CourseServices = {
  createCourseIntoDB,
  getAllCourcesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultieswithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
