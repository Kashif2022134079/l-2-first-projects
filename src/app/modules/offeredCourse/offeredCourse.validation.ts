import { z } from 'zod';
export const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'])),
      startTime: z.string().refine(
        (time) => {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return timeRegex.test(time);
        },
        {
          message: 'Time must be in HH:MM 24-hour format',
        },
      ),
      endTime: z.string().refine(
        (time) => {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return timeRegex.test(time);
        },
        {
          message: 'Time must be in HH:MM 24-hour format',
        },
      ),
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      {
        message: 'endTime must be after startTime',
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
};
