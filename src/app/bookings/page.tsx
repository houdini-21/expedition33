import dynamic from "next/dynamic";

const BookingsCalendar = dynamic(() => import("./BookingsCalendar"), {
  ssr: true,
});

export default function BookingsPage() {
  return <BookingsCalendar />;
}
