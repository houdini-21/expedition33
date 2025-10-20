import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .min(1, 'GOOGLE_CALLBACK_URL is required'),
  GOOGLE_CALENDAR_CALLBACK_URL: z
    .string()
    .url()
    .min(1, 'GOOGLE_CALENDAR_CALLBACK_URL is required'),
  APP_POST_CONNECT_REDIRECT: z.string().url().optional().default('/'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  TOKEN_ENCRYPTION_KEY: z
    .string()
    .min(16, 'TOKEN_ENCRYPTION_KEY must be at least 16 characters long'),
  FRONTEND_PUBLIC_URL: z
    .string()
    .url()
    .min(1, 'FRONTEND_PUBLIC_URL is required'),
});

export type Env = z.infer<typeof envSchema>;
