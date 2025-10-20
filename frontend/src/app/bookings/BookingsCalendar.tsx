"use client";

import { useEffect, useMemo } from "react";
import { Calendar, Views, SlotInfo, ToolbarProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { localizer } from "@/lib/calendarLocalizer";
import { calendarMessages } from "@/lib/calendarMessages";
import { calendarFormats } from "@/lib/calendarFormats";
import { useBookings } from "@/hooks/useBookings";
import CalendarToolbar from "@/components/calendar/CalendarToolbar";
import CalendarEvent from "@/components/calendar/CalendarEvent";
import BookingCreatePanel from "@/components/calendar/BookingDetailsPanel";
import type {
  CalendarEventProps,
  CalendarEvent as EventType,
} from "@/types/bookings";
import classNames from "classnames";

export default function BookingsCalendar() {
  const {
    calRef,
    events,
    title,
    draft,
    setDraft,
    isSaving,
    createBooking,
    onRangeChange,
    refreshCurrentWeek,
    cancelBooking,
    updateBooking,
  } = useBookings();

  useEffect(() => {
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

  // Customize event appearance to have no background or border
  const eventPropGetter = () => ({
    style: {
      backgroundColor: "transparent",
      border: "none",
      padding: 0,
      boxShadow: "none",
    },
  });

  // Handle selecting a time slot to create a new booking
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setDraft({
      id: "draft",
      title: "",
      startsAt: slotInfo.start as Date,
      endsAt:
        (slotInfo.end as Date) ??
        new Date((slotInfo.start as Date).getTime() + 60 * 60 * 1000),
      status: "active",
    });
  };

  return (
    <>
      <div
        className={classNames(
          "grid gap-6 transition-all duration-300",
          draft ? "lg:grid-cols-[1fr_360px]" : "lg:grid-cols-1"
        )}
      >
        {/* Calendar */}
        <div className="calendar-card">
          <Calendar<EventType>
            ref={calRef as React.Ref<Calendar<EventType>>}
            localizer={localizer}
            events={events}
            defaultDate={new Date()}
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
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(e) => {
              if (e.status === "cancelled") return;
              setDraft(e);
            }}
            messages={calendarMessages}
            formats={calendarFormats}
            eventPropGetter={eventPropGetter}
          />
        </div>

        <div className={classNames("", draft ? "block" : "hidden")}>
          <BookingCreatePanel
            draft={draft as EventType}
            disabled={isSaving}
            onClose={() => setDraft(null)}
            onCancel={async (id) => {
              await cancelBooking(id);
            }}
            onUpdate={async (payload) => {
              await updateBooking(payload);
            }}
            onCreate={async (payload) => {
              await createBooking(payload);
            }}
          />
        </div>
      </div>
    </>
  );
}
