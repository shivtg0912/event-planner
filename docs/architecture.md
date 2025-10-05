# Event Planner Architecture

This document outlines the architecture of the Event Planner application.

## High-Level Overview

The Event Planner is a web application built with Next.js and TypeScript. It allows users to create, manage, and view their events. The application uses a PostgreSQL database with Prisma ORM for data management and NextAuth.js for authentication.

## Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (v15) with [React](https://react.dev/) (v19)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Linting**: [ESLint](https://eslint.org/)
*   **Package Manager**: [npm](https://www.npmjs.com/)

## Project Structure

The project follows the standard Next.js `app` directory structure:

```
.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── events/
│   ├── dashboard/
│   ├── lib/
│   └── components/
├── prisma/
│   └── schema.prisma
├── public/
└── package.json
```

*   **`app/`**: Contains the core application code.
    *   **`app/api/`**: Houses the API routes that handle the application's backend logic.
        *   `auth/`: Manages user authentication, registration, and session management using NextAuth.js.
        *   `events/`: Provides CRUD (Create, Read, Update, Delete) operations for events.
    *   **`app/dashboard/`**: Contains the user-facing pages for managing events. These routes are protected and require authentication.
    *   **`app/lib/`**: Includes the Prisma client instance for database interactions.
    *   **`app/components/`**: Stores reusable React components used throughout the application.
*   **`prisma/`**: Manages the database schema and migrations.
    *   `schema.prisma`: Defines the database models (User, Event) and their relationships.
*   **`public/`**: Contains static assets like images and icons.
*   **`package.json`**: Lists the project dependencies and scripts.

## Database Schema

The database schema is defined in `prisma/schema.prisma` and consists of two main models:

*   **`User`**: Represents a user of the application.
*   **`Event`**: Represents an event created by a user.

## Authentication

Authentication is handled by NextAuth.js. The configuration in `app/api/auth/[...nextauth]/route.ts` sets up the authentication providers and session management.

## API Endpoints

The application exposes several API endpoints under `/api`:

*   **/api/auth/**: Handled by NextAuth.js for authentication.
*   **/api/events**: For creating and fetching events.
*   **/api/events/[id]**: For updating and deleting a specific event.
