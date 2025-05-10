import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

export const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z
      .enum([...SemesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().min(0),
    maxCredit: z.number().min(0),
  }),
});
export const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...SemesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().min(0).optional(),
    maxCredit: z.number().min(0).optional(),
  }),
});
export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
