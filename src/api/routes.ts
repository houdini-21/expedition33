export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const routes = {
  auth: {
    login: "/auth/google",
    me: "/auth/me",
  },
  booking: {
    list: "/bookings",
    create: "/bookings",
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
  integrations: {
    googleOAuthUrl: "/integrations/google/oauth-url",
    googleConnect: "/integrations/google",
  },
} as const;
