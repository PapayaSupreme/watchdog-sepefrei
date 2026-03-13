import { z } from 'zod';

const sanitizeText = (value) => value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();


export const createReportSchema = z.object({
  reporterName: z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().min(1).max(80)),
  message: z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(500))
    .optional()
    .default(''),
});

