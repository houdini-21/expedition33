# 📖 Booking Service

This project implements a **Booking Management System** using **NestJS + Prisma (PostgreSQL)** following the **Hexagonal Architecture (Ports & Adapters)** pattern.

The goal is to decouple the **business logic** (application/domain) from the **technical details** (infrastructure: Prisma, DB, HTTP framework).

---

## 📂 Project Structure

The project follows **Hexagonal Architecture** with the following layers:

- **application/** 💼  
  Contains DTOs (commands, queries, results), errors, ports (interfaces/contracts), and use cases (Create, Update, Cancel, Get...).

- **domain/** 🧠  
  Business entities (Booking, Account, Status) and repository interfaces. Pure logic without dependencies.

- **infrastructure/** ⚙️  
  Adapters for external services and persistence. Includes authentication (Google/JWT), Google Calendar integration, Prisma persistence, and security.

- **presentation/** 🎨  
  HTTP controllers, modules, DTOs, and mappers for Auth, Booking, Google Calendar, Health.

- **common/** 🔧  
  Cross-cutting concerns like filters, pipes, and HTTP helpers.

- **config/** ⚙️  
  Configuration module and environment schema validation.

- **main.ts & app.module.ts**  
  NestJS bootstrap and root module.

---

## 🚀 Main Endpoints

### 🌐 Root & Health

- `GET /` → Returns API root or version info.
- `GET /health` → Health check endpoint to verify server status.

### 📅 Bookings

- `GET /bookings` → Returns all bookings for the authenticated user.
- `GET /bookings/:id` → Returns details of a specific booking.
- `POST /bookings` → Creates a new booking (validates range and overlaps).
- `PATCH /bookings/:id` → Updates an existing booking.
- `PATCH /bookings/:id/cancel` → Cancels a booking (`statusId = 2`).

### 🔐 Authentication (Google OAuth2)

- `GET /auth/google` → Redirects to Google OAuth2.
- `GET /auth/google/callback` → Handles Google callback and validates user.
- `GET /auth/me` → Returns authenticated user profile.
- `GET /auth/logout` → Clears session cookie and invalidates JWT.

### 📅 Google Calendar Integration

- `GET /integrations/google` → Health check for Google Calendar integration.
- `GET /integrations/google/oauth-url` → Returns the Google OAuth consent URL.
- `GET /integrations/google/callback` → Handles Google OAuth2 callback (token exchange).
- `GET /integrations/google/status` → Checks current Google Calendar connection status.

---

## 📖 API Documentation (Swagger)

This project includes **Swagger UI** for interactive API documentation.

Once the server is running, open:

```
http://localhost:4000/api/docs
```

Features:

- Automatic generation of docs from decorators.
- Interactive testing of endpoints.
- Clear visibility into request DTOs and response schemas.

---

## 📚 References

- [Hexagonal Architecture – Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture – Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design Community](https://www.dddcommunity.org/)
- [NestJS Docs – Providers & Dependency Injection](https://docs.nestjs.com/providers)
- [Prisma Docs](https://www.prisma.io/docs/)
- Book: _Clean Code_ – Robert C. Martin
- Book: _Implementing Domain-Driven Design_ – Vaughn Vernon

---

## ✅ Benefits of this Approach

- **Scalability**: adapters (Prisma, Google) can be swapped without touching business logic.
- **Testability**: Use cases can be tested independently using mock ports.
- **Maintainability**: Clear separation between business rules and infrastructure details.
