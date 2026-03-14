import { z } from 'zod';

// Sanitizes free text input (value) by removing angle brackets, collapsing whitespace, and returning trimmed text.
const sanitizeText = (value) => value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();


// Validates and sanitizes report payload fields (reporterName, message) and returns parsed values through Zod.
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

