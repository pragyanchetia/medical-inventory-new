# Medical Inventory Management System

A full-stack web application for managing medical inventory, tracking medicine stock, maintaining supplier and purchase records, and handling sales and billing workflows.

## Overview

The Medical Inventory Management System is designed to organize day-to-day inventory operations for a medical business. It provides a centralized interface for managing medicine details, monitoring batch-level stock and expiry information, recording purchases, and maintaining sales and billing records.

The application uses a React-based frontend, a Node.js backend, and Prisma ORM with SQLite for data persistence.

## Features

- **Medicine Management:** Maintain medicine records, including product details, manufacturers, packaging information, HSN details, and related inventory data.
- **Inventory Tracking:** Organize stock at the batch level and maintain expiry information.
- **Supplier Management:** Maintain vendor information for purchase-related operations.
- **Purchase Management:** Record purchase invoices and manage their associated line items.
- **Sales and Billing:** Maintain sales memos and billing information, including patient and doctor details where applicable, along with invoice totals.
- **Form Validation:** Use structured form handling and schema validation for supported input workflows.
- **Database Management:** Use Prisma ORM and SQLite to manage application data and database migrations.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Material UI
- Radix UI
- React Hook Form
- Zod

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite

### Authentication and Security
- JWT-based authentication
- bcrypt for password hashing

### Supporting Tools
- Axios for HTTP requests
- Prisma migrations for database schema management

## Architecture

The application follows a client-server architecture:

1. **Frontend:** Provides the user interface for inventory, purchase, and billing workflows.
2. **Backend API:** Handles application requests and business logic.
3. **Database:** Stores application records using SQLite, accessed through Prisma ORM.

## Getting Started

### Prerequisites

Install the following tools before running the application:

- Node.js and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/pragyanchetia/medical-inventory-new.git
cd medical-inventory-new
```

### Install Dependencies

Install the dependencies separately in the frontend and backend directories, using the package files provided by the repository.

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

> **Note:** Adjust the directory names if the repository uses a different frontend/backend structure. Use the scripts defined in each `package.json` to start the respective services.

### Configure Environment Variables

Create the environment files required by the frontend and backend. Configure the API URL, authentication secrets, and database connection according to the project's configuration.

Do not commit `.env` files, credentials, or production secrets to GitHub.

### Database Setup

Configure the SQLite database connection used by Prisma. If the project defines Prisma migrations, apply the appropriate migrations using the scripts or commands specified in the repository.

For example, where supported by the project's Prisma configuration:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development, use the migration workflow documented by the project. Back up any existing database before applying migrations to a database containing important data.

### Run the Application

Start the backend and frontend using the development scripts defined in their respective `package.json` files. Open the local frontend URL printed by the frontend development server.

Refer to the actual project configuration for the correct ports, environment variables, and startup commands.

## Project Structure

The application contains frontend and backend code, database configuration, and supporting application modules. Refer to the repository directories for the current implementation structure.

## Future Improvements

- Add automated unit and integration tests.
- Strengthen request validation and role-based access control.
- Improve error handling and audit logging.
- Document database backup and restoration procedures.
- Add deployment configuration and production-readiness checks.

## Disclaimer

This project is a software development project for medical inventory workflows. It is not a certified medical device or a substitute for validated healthcare or financial systems. Review authentication, access control, data protection, backups, and deployment configuration before using it with real business or patient data.

## Author

**Pragyan Chetia**
