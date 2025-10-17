export const GOOGLE_CALENDAR_PORT = Symbol('GOOGLE_CALENDAR_PORT');

export interface IGoogleCalendarPort {
  hasBusy(userId: string, start: Date, end: Date): Promise<boolean>;

  // OAuth related helpers used by presentation layer
  getAuthUrl(userId: string): string;
  handleCallback(code: string, stateUserId: string): Promise<void>;
  isConnected(userId: string): Promise<boolean>;

  // Redirect url after connect
  readonly postConnectRedirect: string;
}
