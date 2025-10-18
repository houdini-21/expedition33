export interface ApiResponse<T = unknown> {
  code: number | string;
  message: string;
  data: T | null;
}
