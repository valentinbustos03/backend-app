import { z } from 'zod';

function isRealDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const ReportDate = (field: string) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${field} must be in YYYY-MM-DD format`)
    .refine(isRealDate, { message: `${field} is not a real calendar date` })
    .optional();

export const ReportFilterSchema = z
  .object({
    from: ReportDate('From'),
    to: ReportDate('To'),
  })
  .refine((filter) => !filter.from || !filter.to || filter.from <= filter.to, {
    message: 'From must be earlier than or equal to To',
    path: ['from'],
  });

export type ReportFilterInput = z.infer<typeof ReportFilterSchema>;
