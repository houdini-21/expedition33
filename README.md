# 📖 Full Stack Booking System

This repository implements a **full-stack booking management system**, developed as part of a **technical test**.  
It consists of two main projects:

- **Backend** → NestJS + Prisma + PostgreSQL (Hexagonal Architecture).  
- **Frontend** → Next.js 15 + React + Tailwind CSS (App Router).  

The goal was to build a complete system that allows users to **log in with Google, manage bookings, prevent conflicts with Google Calendar, and deploy the solution using Docker**.

---

## 🎯 Challenge Summary

The test required building a full-stack application where:

1. Users can **log in with Google**.  
2. Users can **create, view, and cancel bookings**.  
3. The system prevents conflicts with:  
   - Existing bookings in the system.  
   - Events already present in the user’s **Google Calendar**.  
4. Users can **connect their Google Calendar** to check conflicts before confirming a booking.  
5. The system should be **Docker-ready**, using **Postgres instead of SQLite**.  
6. Extended challenge: implement **Auth0** as an authentication provider.  

---

## 🏗️ Architecture Overview

### Backend (NestJS + Prisma + PostgreSQL)

- **Hexagonal Architecture (Ports & Adapters)**: clean separation between domain logic and infrastructure.  
- **Authentication**: JWT-based session management with Google OAuth2 integration.  
- **Entities**: Bookings, Users, Status.  
- **Use Cases**: Create, update, cancel, and fetch bookings.  
- **Google Calendar Integration**:  
  - Verifies conflicts before confirming a booking.  
  - Handles OAuth2 connection with Google.  
- **Persistence**: PostgreSQL with Prisma ORM.  
- **API Docs**: Swagger UI with full endpoint documentation.  

🔑 Main endpoints:  
- `POST /bookings` → create booking  
- `PATCH /bookings/:id` → update booking  
- `DELETE /bookings/:id` → cancel booking  
- `GET /bookings?start&end` → fetch by date range (ISO 8601)  
- `GET /auth/google` → start Google login  
- `GET /auth/logout` → clear session  

---

### Frontend (Next.js 15 + React + Tailwind CSS)

- **Next.js App Router** for pages and layouts.  
- **Google Login** button connected to backend auth route.  
- **Calendar UI** with `react-big-calendar`:  
  - Displays active/cancelled bookings.  
  - Allows interaction (create, edit, cancel).  
- **Booking Panel**: Side panel form reused for both creating and editing bookings.  
- **Middleware**: Protects private routes, checks for session cookie.  
- **Hooks (`useBookings`)**: Centralize fetching, creating, updating, and cancelling bookings.  
- **Services Layer**:  
  - `http.ts` → fetch wrapper with credentials.  
  - `routes.ts` → centralized API paths.  
- **TypeScript Types**: clear distinction between `ServerBooking` (DTO) and `CalendarEvent` (UI model).  

---

## 🔌 Integration Flow

1. **Login**  
   User clicks “Login with Google” → redirected to backend → Google OAuth2 → backend sets session cookie.  

2. **Calendar View**  
   Frontend fetches `/bookings?start&end` and displays events in React Big Calendar.  

3. **Booking Creation/Update**  
   - User opens panel, fills form (title, start, end).  
   - Frontend calls `/bookings`.  
   - Backend validates against:  
     - Existing DB bookings.  
     - Google Calendar events.  

4. **Cancel Booking**  
   - User cancels event → frontend calls `DELETE /bookings/:id`.  
   - Backend updates status (`cancelled`).  

---

## 🐳 Deployment

- **Dockerized setup** with:  
  - Backend container (NestJS + Prisma + Postgres).  
  - Frontend container (Next.js).  
- Configured for production builds and environment variables.  
- Ready for deployment on any Docker-compatible environment.  

---

## ✅ Key Achievements

- **Clean separation**: Frontend (UI & hooks) and Backend (hexagonal architecture).  
- **Google integrations**: OAuth2 + Calendar conflict validation.  
- **Scalability**: PostgreSQL instead of SQLite, Dockerized deployment.  
- **Code Quality**:  
  - Clear commit messages (Conventional Commits).  
  - Separation of concerns (services, hooks, lib).  
  - Typed DTOs and mappers.  
- **PWA Ready**: Frontend optimized as a Progressive Web App.  


---

## 🚀 CI/CD & Deployment

- This project includes **CI/CD pipelines** for automated build, test, and deployment.  
- Deployed on a production server with Docker.  
- Accessible at:  
  - **Backend API**: https://api.houdini-21.tech/  
  - **Frontend App**: https://app.houdini-21.tech/  

---

## 📚 References

- [NestJS Docs](https://docs.nestjs.com/)  
- [Prisma Docs](https://www.prisma.io/docs/)  
- [Next.js 15 Docs](https://nextjs.org/docs)  
- [React Big Calendar](https://github.com/jquense/react-big-calendar)  
- [Clean Architecture – Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/The-Clean-Architecture.html)  
- [Hexagonal Architecture – Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)  

---
