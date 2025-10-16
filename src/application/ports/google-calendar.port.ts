export const GOOGLE_CALENDAR_PORT = Symbol('GOOGLE_CALENDAR_PORT');

export interface IGoogleCalendarPort {
  hasBusy(userId: string, start: Date, end: Date): Promise<boolean>;
}
