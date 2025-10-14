import type { ApiResponse } from './response.util';

export const ok = <T>(
  data: T,
  message = 'Success',
  code = 'OK',
): ApiResponse<T> => ({
  code,
  message,
  data,
});

export const fail = (
  code: string,
  message: string,
  data: unknown = null,
): ApiResponse => ({
  code,
  message,
  data,
});
