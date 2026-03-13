import { z } from 'zod';

const urlSchema = z
  .string()
  .url('URL must be valid')
  .refine((value) => value.startsWith('http://') || value.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

export const createMonitorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  url: urlSchema,
  frequencySeconds: z.number().int().min(15).max(3600),
});

export const createReportSchema = z.object({
  reporterName: z.string().trim().min(1).max(80),
  message: z.string().trim().max(500).optional().default(''),
});

