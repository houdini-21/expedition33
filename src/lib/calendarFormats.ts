import { format } from "date-fns";

export const calendarFormats = {
  dayHeaderFormat: (date: Date) => format(date, "EEEE d"),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
  timeGutterFormat: (date: Date) => format(date, "HH:mm"),
};

export const rangeToTitle = (start: Date, end: Date) =>
  `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
