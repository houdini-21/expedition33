import dynamic from "next/dynamic";
import ConnectGoogleButton from "./ConnectGoogleButton";

const BookingsCalendar = dynamic(() => import("./BookingsCalendar"), {
  ssr: true,
});

export default function BookingsPage() {
  return (
    <div className="p-6">
      <div className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-600">Bookings</h1>
            <p className="text-gray-500 text-sm">Manage your bookings</p>
          </div>
          <ConnectGoogleButton />
        </header>

        <BookingsCalendar />
      </div>
    </div>
  );
}
