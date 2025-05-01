import { z } from 'zod';

const preRequisiteCourseZodSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(), // since default is false, optional here
});
// Course Zod schema
export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    prefix: z.string().trim().min(1, { message: 'Prefix is required' }),
    code: z.number(),
    credits: z.number(),
    preRequisieteCourses: z.array(preRequisiteCourseZodSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});
const updatePreRequisiteCourseZodSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(), // since default is false, optional here
});
// Course Zod schema
export const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    prefix: z.string().trim().min(1).optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisieteCourses: z
      .array(updatePreRequisiteCourseZodSchema)
      .optional()
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const facultyWithCourseValidationSchema = z.object({
  body: z.object({ faculties: z.array(z.string()) }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultyWithCourseValidationSchema,
};
