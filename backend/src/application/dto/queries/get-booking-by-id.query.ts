export interface GetBookingByIdQuery {
  id: string;
  userId: string; // ownership/authorization check
}
