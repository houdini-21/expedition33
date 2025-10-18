"use client";

import { useCallback, useRef, useState } from "react";
import { startOfWeek } from "date-fns";
import type { Calendar } from "react-big-calendar";
import type { ApiResponse } from "@/types/api";
import { http } from "@/api/http";
import { routes } from "@/api/routes";
import { rangeToTitle } from "@/lib/calendarFormats";
import type { CalendarEvent, ServerBooking } from "@/types/bookings";

type RbcCalendarRef = Calendar<CalendarEvent> | null;

export function useBookings() {
  const calRef = useRef<RbcCalendarRef>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState<string>("");

  const fetchByRange = useCallback(async (start: Date, end: Date) => {
    const qs = new URLSearchParams({
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    });

    const res = await http<ApiResponse<ServerBooking[]>>(
      `${routes.booking.list}?${qs.toString()}`
    );

    setEvents(
      res.data.map((b: ServerBooking): CalendarEvent => ({
      id: b.id,
      title: b.title,
      startsAt: new Date(b.startsAt),
      endsAt: new Date(b.endsAt),
      status: b.status,
      }))
    );
    setTitle(rangeToTitle(start, end));
  }, []);

  const refreshCurrentWeek = useCallback(() => {
    const api: RbcCalendarRef = calRef.current;
    const dateProp = api?.props?.date;
    const baseDate: Date = dateProp
      ? typeof dateProp === "string"
        ? new Date(dateProp)
        : dateProp
      : new Date();
    const refStart = startOfWeek(baseDate, { weekStartsOn: 1 });
    const refEnd = new Date(refStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    fetchByRange(refStart, refEnd);
  }, [fetchByRange]);

  const createBooking = useCallback(
    async (title: string, start: Date, end?: Date) => {
      await http(routes.booking.create, {
        method: "POST",
        body: JSON.stringify({
          title,
          startAt: start.toISOString(),
          endAt: (
            end ?? new Date(start.getTime() + 60 * 60 * 1000)
          ).toISOString(),
        }),
      });
      refreshCurrentWeek();
    },
    [refreshCurrentWeek]
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      await http(routes.booking.cancel(id), { method: "DELETE" });
      refreshCurrentWeek();
    },
    [refreshCurrentWeek]
  );

  const onRangeChange = useCallback(
    (range: Date[] | { start: Date; end: Date }) => {
      if (Array.isArray(range) && range.length >= 2) {
        fetchByRange(range[0], range[range.length - 1]);
      } else if (!Array.isArray(range) && range.start && range.end) {
        fetchByRange(range.start, range.end);
      }
    },
    [fetchByRange]
  );

  return {
    calRef,
    events,
    title,
    fetchByRange,
    createBooking,
    cancelBooking,
    onRangeChange,
    refreshCurrentWeek,
  };
}
