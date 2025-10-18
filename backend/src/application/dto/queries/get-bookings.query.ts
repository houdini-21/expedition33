export interface GetBookingsQuery {
  userId: string;
  from?: Date;
  to?: Date;
  status?: 'active' | 'cancelled';
  page?: number;
  pageSize?: number;
}
