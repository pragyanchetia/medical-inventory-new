<div align="center">

# Medical Inventory Management System

**A full-stack application for managing medicine stock, batches, vendors, purchase invoices, and sales memos.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-20232A?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Backend-Express-404D59?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite)](https://www.sqlite.org/)

</div>

---

## Overview

The Medical Inventory Management System is a full-stack application intended to support day-to-day medicine inventory workflows. Its data model covers medicines, stock batches, vendors, purchase invoices, invoice line items, memos, and user accounts.

The frontend is built with Next.js and React. The backend exposes Express API routes and uses Prisma with a local SQLite database.

## Core Modules

- **Medicine inventory** — maintain medicine names, types, manufacturers, pack details, HSN information, and total stock.
- **Batch tracking** — record batch numbers, quantities, expiry details, locations, rates, MRP, GST, and discounts.
- **Vendor management** — store supplier information and associate vendors with invoices.
- **Purchase invoices** — capture invoice-level totals and medicine line items.
- **Memos / billing workflow** — record customer or patient memo details and the medicines included in a memo.
- **Database backup route** — includes a dedicated backend route for backup-related operations.
- **User accounts and authentication** — backend routes and middleware support user-related operations and token-based authentication.
 
## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React |
| UI components | Material UI, Radix UI |
| Forms and validation | React Hook Form, Zod |
| API communication | Axios |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Authentication utilities | JSON Web Tokens, bcryptjs |

## Repository Layout

```text
frontend/                 Next.js UI
backend/
  src/
    index.ts              Express server entry point
    middleware/           Authentication middleware
    routes/               User, inventory, invoice, vendor, memo, backup APIs
  prisma/
    schema.prisma         Database schema
    migrations/           Schema migration history
```

## Getting Started

### Prerequisites

- Node.js and npm
- A terminal
- Environment configuration where required

### 1. Clone the repository

```bash
git clone https://github.com/pragyanchetia/medical-inventory-new.git
cd medical-inventory-new
```

### 2. Set up the backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

The backend defaults to port **4000** unless `PORT` is set. Its Prisma schema uses a SQLite file at `backend/prisma/dev.db`.

### 3. Set up the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The Next.js development server normally runs at [http://localhost:3000](http://localhost:3000). The backend currently configures CORS for that local origin.

### Production build

Frontend:

```bash
cd frontend
npm run build
npm start
```

Backend, in a separate terminal:

```bash
cd backend
npm run build
npm start
```

## Environment and Database Notes

- Review the backend and frontend configuration before running the app.
- Keep credentials and environment files out of Git.
- The backend checks for the SQLite database file before serving several API route groups.
- Create or restore the database using the project's Prisma schema and migrations. Do not overwrite an existing database with sample or empty data.

## Development Scripts

| Directory | Command | Purpose |
|---|---|---|
| `frontend` | `npm run dev` | Run Next.js in development |
| `frontend` | `npm run build` | Build the frontend |
| `backend` | `npm run dev` | Run the backend with Nodemon |
| `backend` | `npm run build` | Generate Prisma Client and compile TypeScript |
| `backend` | `npm start` | Start the compiled backend |

## Security and Production Readiness

This project manages inventory and billing-style records, so production deployment should include secure secrets management, HTTPS, access controls, tested backups, input validation, and a review of authentication/session settings. Avoid using real patient or business data in development environments.

## Author

[Pragyan Chetia](https://github.com/pragyanchetia)
