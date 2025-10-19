# 📖 Booking Service (Frontend)

This project implements a **Booking Management System (Frontend)** using **Next.js 15 (App Router)**, designed to interact with a backend powered by **NestJS + Prisma (PostgreSQL)**.  
The frontend follows a clean architecture approach, separating concerns between UI, business logic (hooks), and infrastructure (API services).

---

## 📂 Project Structure

The project follows a layered and modular organization:

- **app/** 🎨  
  Next.js App Router with routes for authentication and bookings.

- **components/** 🧩  
  Reusable UI components (calendar views, booking panels, authentication buttons).

- **hooks/** 🔄  
  Business logic hooks (e.g., `useBookings`) to manage state, fetching, and user interactions.

- **providers/** 🌍  
  Context providers for global state, like authentication.

- **lib/** ⚙️  
  Pure utility functions (calendar localizer, messages, and formatters).

- **services/** 📡  
  HTTP client wrapper (`fetch` with credentials) and centralized API routes.

- **types/** 📝  
  TypeScript DTOs and models (e.g., `ServerBooking`, `CalendarEvent`).

- **middleware.ts** 🔐  
  Middleware for session-based route protection.

---

## 🚀 Main Features

- **Authentication**: Google OAuth login with session cookie support.  
- **Booking Management**:  
  - List bookings within a date range.  
  - Create new bookings.  
  - Update existing bookings.  
  - Cancel bookings.  
  - Prevent creating or moving events into the past.  
- **Calendar UI**:  
  - Interactive booking calendar built with `react-big-calendar`.  
  - Custom event cards with status styling (active, cancelled).  
  - Toolbar navigation and localization (formats/messages).  
- **Booking Panel**: Side panel form for creating and editing bookings with the same UI design.  
- **Protected Routes**: Middleware ensures only authenticated users can access bookings.  

---

## 🔌 API Endpoints Consumed

The frontend consumes REST endpoints exposed by the backend:

### Authentication
- `GET /auth/login/google` → Google OAuth login.  
- `GET /auth/logout` → Logout and clear session.  

### Bookings
- `GET /bookings?start=2025-10-18T00:00:00.000Z&end=2025-10-25T23:59:59.999Z` → Fetch bookings by range (ISO 8601 format).  
- `POST /bookings` → Create a booking.  
- `PATCH /bookings/:id` → Update a booking.  
- `PATCH /bookings/:id` → Cancel a booking.  

### Google Calendar Integration
- Optional integration endpoints for syncing with Google Calendar.  

---

## 📖 Development Notes

- **Clean Architecture Principles**:  
  - UI components are presentation-only.  
  - Hooks handle application logic (fetching, state, actions).  
  - Services encapsulate external API communication.  
  - Utilities are pure and reusable across layers.  

- **Error Handling**:  
  API client throws typed errors, ensuring consistent error management in hooks/components.  

- **Type Safety**:  
  All requests and responses are typed, separating server DTOs from UI models.  

---

## ✅ Benefits

- **Separation of Concerns**: Each layer (UI, logic, API) is independent.  
- **Scalability**: New endpoints or UI features can be added without breaking the structure.  
- **Testability**: Hooks and mappers can be tested independently.  
- **Maintainability**: Clean file organization makes the project easy to navigate.  

---

## 📚 References

- [Next.js Docs](https://nextjs.org/docs)  
- [React Big Calendar](https://github.com/jquense/react-big-calendar)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Clean Architecture – Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/The-Clean-Architecture.html)  

---
