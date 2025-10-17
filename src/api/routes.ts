export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const routes = {
  authGoogleStart: "/auth/google",
  bookingsList: "/bookings",
  booking: {
    list: "/bookings",
    create: "/bookings",
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
} as const;
