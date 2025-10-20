export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// Define all API routes in a structured manner
export const routes = {
  auth: {
    login: "/auth/google",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  booking: {
    list: "/bookings",
    create: "/bookings",
    update: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
  integrations: {
    googleOAuthUrl: "/integrations/google/oauth-url",
    googleConnect: "/integrations/google",
    googleCalendarStatus: "/integrations/google/status",
  },
} as const;
