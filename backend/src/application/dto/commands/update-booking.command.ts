export interface UpdateBookingCommand {
  id: string;
  input: {
    userId: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
  };
}
