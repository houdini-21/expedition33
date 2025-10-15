import type { ApiResponse } from './response.util';

export const ok = <T>(
  data: T,
  message = 'Success',
  code = 200,
): ApiResponse<T> => ({
  code,
  message,
  data,
});

export const created = <T>(
  data: T,
  message = 'Resource created successfully',
  code = 201,
): ApiResponse<T> => ({
  code,
  message,
  data,
});

export const noContent = (
  message = 'No content',
  code = 204,
): ApiResponse<null> => ({
  code,
  message,
  data: null,
});

export const fail = (
  code: number,
  message: string,
  data: unknown = null,
): ApiResponse => ({
  code,
  message,
  data,
});
