export interface CancelBookingCommand {
  id: string;
  input: {
    userId: string;
  };
}
