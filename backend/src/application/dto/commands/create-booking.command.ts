export interface CreateBookingCommand {
  input: {
    userId: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
  };
}
