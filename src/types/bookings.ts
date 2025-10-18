import type { EventProps, ToolbarProps, NavigateAction } from "react-big-calendar";

export type Status = "active" | "cancelled";

export interface ServerBooking {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: Status;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  status: Status;
}

// Props for the Calendar toolbar
export interface CalendarToolbarProps extends ToolbarProps<CalendarEvent> {
  titleText: string;
  label: string;
  tileText?: string;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
}

// Props for the custom Event renderer
export type CalendarEventProps = EventProps<CalendarEvent>;
