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
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700">
          {titleText || label || "Bookings"}
        </h1>
        <p className="text-gray-500">Weekly overview of your bookings</p>
      </div>
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate("PREV")}
          className="text-2xl text-gray-800 cursor-pointer"
          aria-label="Previous"
        >
          &#10094;
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="text-2xl text-gray-800 cursor-pointer"
          aria-label="Next"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
