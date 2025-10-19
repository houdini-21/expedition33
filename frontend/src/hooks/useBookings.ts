"use client";

import { useCallback, useRef, useState } from "react";
import { startOfWeek } from "date-fns";
import type { Calendar } from "react-big-calendar";
import type { ApiResponse } from "@/types/api";
import { http } from "@/api/http";
import { routes } from "@/api/routes";
import { rangeToTitle } from "@/lib/calendarFormats";
import type { CalendarEvent, ServerBooking } from "@/types/bookings";
import { toast } from "react-toastify";

type RbcCalendarRef = Calendar<CalendarEvent> | null;

export function useBookings() {
  const calRef = useRef<RbcCalendarRef>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState<string>("");
  const [draft, setDraft] = useState<CalendarEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mapServer = (b: ServerBooking): CalendarEvent => ({
    id: b.id,
    title: b.title,
    startsAt: new Date(b.startsAt),
    endsAt: new Date(b.endsAt),
    status: b.status,
  });

  const fetchByRange = useCallback(async (start: Date, end: Date) => {
    const qs = new URLSearchParams({
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    });
    const res = await http<ApiResponse<ServerBooking[]>>(
      `${routes.booking.list}?${qs.toString()}`
    );
    setEvents(res.data.map(mapServer));
    setTitle(rangeToTitle(start, end));
  }, []);

  const refreshCurrentWeek = useCallback(() => {
    const api: RbcCalendarRef = calRef.current;
    const dateProp = api?.props?.date;
    const baseDate: Date =
      dateProp && typeof dateProp !== "string" ? dateProp : new Date();
    const refStart = startOfWeek(baseDate, { weekStartsOn: 0 });
    const refEnd = new Date(refStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    fetchByRange(refStart, refEnd);
  }, [fetchByRange]);

  const createBooking = useCallback(
    async (payload: { title: string; startsAt: Date; endsAt: Date }) => {
      setIsSaving(true);
      try {
        await http(routes.booking.create, {
          method: "POST",
          body: JSON.stringify({
            title: payload.title,
            startAt: payload.startsAt.toISOString(),
            endAt: payload.endsAt.toISOString(),
          }),
        });
        setDraft(null);
        refreshCurrentWeek();
        toast.success("Booking created successfully");
      } catch (error: unknown) {
        toast.error((error as Error)?.message || "Failed to create booking");
      } finally {
        setIsSaving(false);
      }
    },
    [refreshCurrentWeek]
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await http(routes.booking.cancel(id), { method: "PATCH" });
        setDraft(null);
        refreshCurrentWeek();
        toast.success("Booking cancelled successfully");
      } catch (error: unknown) {
        toast.error((error as Error)?.message || "Failed to cancel booking");
      } finally {
        setIsSaving(false);
      }
    },
    [refreshCurrentWeek]
  );

  const updateBooking = useCallback(
    async (payload: {
      id: string;
      title?: string;
      startsAt?: Date;
      endsAt?: Date;
    }) => {
      setIsSaving(true);
      try {
        await http(routes.booking.update(payload.id), {
          method: "PATCH",
          body: JSON.stringify({
            title: payload.title,
            startAt: payload.startsAt?.toISOString(),
            endAt: payload.endsAt?.toISOString(),
          }),
        });
        setDraft(null);
        refreshCurrentWeek();
        toast.success("Booking updated successfully");
      } catch (error: unknown) {
        toast.error((error as Error)?.message || "Failed to update booking");
      } finally {
        setIsSaving(false);
      }
    },
    [refreshCurrentWeek]
  );

  const onRangeChange = useCallback(
    (range: Date[] | { start: Date; end: Date }) => {
      if (Array.isArray(range) && range.length >= 2)
        fetchByRange(range[0], range[range.length - 1]);
      else if (!Array.isArray(range) && range.start && range.end)
        fetchByRange(range.start, range.end);
    },
    [fetchByRange]
  );

  return {
    calRef,
    events,
    title,
    draft,
    setDraft,
    isSaving,
    fetchByRange,
    refreshCurrentWeek,
    createBooking,
    cancelBooking,
    onRangeChange,
    updateBooking,
  };
}
