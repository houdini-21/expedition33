"use client";

import { CalendarToolbarProps } from "@/types/bookings";

export default function CalendarToolbar({
  onNavigate,
  label,
  titleText,
}: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          {titleText || label || "Bookings"}
        </h1>
        <p className="text-gray-500">Weekly overview of your bookings</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="nav-btn"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="nav-btn"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}
