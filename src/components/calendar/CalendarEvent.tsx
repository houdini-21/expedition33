"use client";

import { format } from "date-fns";
import classNames from "classnames";
import { CalendarEventProps, Status } from "@/types/bookings";

const STATUS_UI: Record<
  Status,
  { card: string; title: string; time: string; border: string }
> = {
  active: {
    card: "bg-blue-50",
    title: "text-blue-800",
    time: "text-blue-600",
    border: "border-blue-200",
  },
  cancelled: {
    card: "bg-rose-50",
    title: "text-rose-700",
    time: "text-rose-600",
    border: "border-rose-200",
  },
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  const start = format(event.startsAt, "HH:mm");
  const end = format(event.endsAt, "HH:mm");
  const status: Status = event.status ?? "active";
  const ui = STATUS_UI[status];

  return (
    <div
      className={[
        "h-full w-full rounded-xl border px-3 py-2 shadow-sm transition-all",
        ui.card,
        ui.border,
      ].join(" ")}
      title={`${event.title} · ${start}–${end}`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-current opacity-40" />
        <div className="min-w-0 flex-1">
          <div
            className={classNames(
              "font-semibold leading-tight truncate text-lg",
              ui.title,
              { "line-through opacity-70 decoration-2": status === "cancelled" }
            )}
          >
            {event.title}
          </div>
          <div className={["mt-1 text-sm font-medium", ui.time].join(" ")}>
            {start} – {end}
          </div>
        </div>
      </div>
    </div>
  );
}
