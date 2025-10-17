"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg, EventSourceFunc } from "@fullcalendar/core";
import { http } from "@/api/http";
import { routes } from "@/api/routes";

type ApiResponse<T> = { code: number; message: string; data: T };

type ServerBooking = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: "active" | "cancelled";
  userId: string;
  user?: { id: string; name: string; email: string; image?: string };
  createdAt: string;
  updatedAt: string;
};

export default function BookingsPage() {
  const loadEvents: EventSourceFunc = async (arg, success, failure) => {
    try {
      const qs = new URLSearchParams({
        startsAt: new Date(arg.start).toISOString(),
        endsAt: new Date(arg.end).toISOString(),
      });
      const res = await http<ApiResponse<ServerBooking[]>>(
        `${routes.booking.list}?${qs.toString()}`
      );

      const events = res.data.map((b) => ({
        id: b.id,
        title: b.title,
        start: b.startsAt,
        end: b.endsAt,
        extendedProps: {
          status: b.status,
          userName: b.user?.name,
          userEmail: b.user?.email,
          userImage: b.user?.image,
        },
      }));

      success(events);
    } catch (err) {
      console.error("Error al listar reservas", err);
      failure(err as Error);
    }
  };

  const handleDateClick = async (arg: DateClickArg) => {
    const title = prompt("Título de la reserva:");
    if (!title) return;

    const startAt = new Date(arg.date).toISOString();
    const endAt = new Date(arg.date.getTime() + 60 * 60 * 1000).toISOString();

    try {
      await http(routes.booking.create, {
        method: "POST",
        body: JSON.stringify({ title, startAt, endAt }),
      });
      arg.view.calendar.refetchEvents();
    } catch (err) {
      console.error("Error al crear reserva", err);
    }
  };

  const handleEventClick = async (arg: EventClickArg) => {
    if (!confirm(`¿Eliminar reserva "${arg.event.title}"?`)) return;
    try {
      await http(routes.booking.cancel(arg.event.id), { method: "PATCH" });
      arg.view.calendar.refetchEvents();
    } catch (err) {
      console.error("Error al eliminar", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mis reservas</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek",
        }}
        events={loadEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        selectable
        editable={false}
        height="auto"
        locale="es"
        slotMinTime="01:00:00"
        slotMaxTime="24:00:00"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
      />
    </div>
  );
}
