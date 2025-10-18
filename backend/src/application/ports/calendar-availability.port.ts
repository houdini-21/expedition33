export abstract class CalendarAvailabilityPort {
  abstract hasConflict(
    userId: string,
    startISO: string,
    endISO: string,
  ): Promise<boolean>;
}
