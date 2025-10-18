"use client";

import { useEffect, useMemo } from "react";
import { Calendar, Views } from "react-big-calendar";
import type { ToolbarProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { localizer } from "@/lib/calendarLocalizer";
import { calendarMessages } from "@/lib/calendarMessages";
import { calendarFormats } from "@/lib/calendarFormats";
import { useBookings } from "@/hooks/useBookings";
import CalendarToolbar from "@/components/calendar/CalendarToolbar";
import CalendarEvent from "@/components/calendar/CalendarEvent";
import type {
  CalendarEvent as EventType,
  CalendarEventProps,
} from "@/types/bookings";

export default function BookingsCalendar() {
  const {
    calRef,
    events,
    title,
    createBooking,
    cancelBooking,
    onRangeChange,
    refreshCurrentWeek,
  } = useBookings();

  useEffect(() => {
    // carga inicial al montar
    refreshCurrentWeek();
  }, [refreshCurrentWeek]);

  const components = useMemo(
    () => ({
      toolbar: (props: ToolbarProps<EventType>) => (
        <CalendarToolbar {...props} titleText={title} />
      ),
      event: (props: CalendarEventProps) => <CalendarEvent {...props} />,
    }),
    [title]
  );

  const eventPropGetter = (): { style: React.CSSProperties } => ({
    style: {
      backgroundColor: "transparent",
      border: "none",
      padding: 0,
      boxShadow: "none",
    },
  });

  return (
    <div className="p-6">
      <div className="calendar-card">
        <Calendar<EventType>
          ref={calRef as React.MutableRefObject<Calendar<EventType> | null>}
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          startAccessor="startsAt"
          endAccessor="endsAt"
          style={{ height: "calc(100vh - 220px)" }}
          components={components}
          step={60}
          timeslots={1}
          min={new Date(1970, 1, 1, 7, 0, 0)}
          max={new Date(1970, 1, 1, 18, 59, 0)}
          onRangeChange={onRangeChange}
          selectable
          onSelectSlot={async (slotInfo) => {
            const t = prompt("Booking title:");
            if (!t) return;
            await createBooking(t, slotInfo.start, slotInfo.end);
          }}
          onSelectEvent={async (e) => {
            if (!confirm(`Delete "${e.title}"?`)) return;
            await cancelBooking(e.id as string);
          }}
          messages={calendarMessages}
          formats={calendarFormats}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
}
