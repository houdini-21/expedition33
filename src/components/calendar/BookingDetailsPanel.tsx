"use client";

import { format, setHours, setMinutes } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/types/bookings";
import classNames from "classnames";

type Props = {
  draft: CalendarEvent | null;
  disabled?: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    startsAt: Date;
    endsAt: Date;
  }) => Promise<void> | void;
};

export default function BookingCreatePanel({
  draft,
  disabled,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    if (!draft) return;
    setTitle(draft.title ?? "");
    const s = format(draft.startsAt, "HH:mm");
    const e = format(draft.endsAt, "HH:mm");
    setStartTime(s);
    setEndTime(e);
  }, [draft]);

  const dateLabel = useMemo(() => {
    if (!draft) return "";
    return format(draft.startsAt, "EEEE, MMM d, yyyy");
  }, [draft]);

  const canSave = !!draft && title.trim().length > 0 && !disabled;

  const buildDates = () => {
    if (!draft) return null;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const start = setMinutes(setHours(draft.startsAt, sh), sm);
    let end = setMinutes(setHours(draft.endsAt, eh), em);

    if (end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
    return { start, end };
  };

  return (
    <aside
      className={classNames(
        "bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 shadow-sm sticky top-4 h-fit transition-all",
        draft
          ? "opacity-100 translate-x-0"
          : "opacity-0 pointer-events-none translate-x-2"
      )}
      aria-hidden={!draft}
    >
      <div className="mb-6">
        <h3 className="text-md text-gray-700 font-bold">Create booking</h3>
        <p className="text-sm text-gray-700">
          {draft ? dateLabel : "Select a slot in the calendar"}
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Name</span>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Booking name"
            disabled={disabled || !draft}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">
              Start
            </span>
            <input
              type="time"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startTime}
              min="07:00"
              max="18:59"
              onChange={(e) => setStartTime(e.target.value)}
              disabled={disabled || !draft}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">End</span>
            <input
              type="time"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endTime}
              min="07:00"
              max="18:59"
              onChange={(e) => setEndTime(e.target.value)}
              disabled={disabled || !draft}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className={classNames(
            "flex-1 h-11 rounded-lg font-semibold text-white cursor-pointer transition-colors",
            canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
          )}
          disabled={!canSave}
          onClick={async () => {
            const built = buildDates();
            if (!built) return;
            const startHour = built.start.getHours();
            const endHour = built.end.getHours();
            if (startHour < 7 || endHour > 19) {
              alert("Booking time must be between 07:00 and 19:00");
              return;
            }
            await onCreate({ title, startsAt: built.start, endsAt: built.end });
          }}
        >
          Create
        </button>

        <button
          className="h-11 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 cursor-pointer"
          onClick={onClose}
          disabled={disabled}
        >
          Close
        </button>
      </div>
    </aside>
  );
}
