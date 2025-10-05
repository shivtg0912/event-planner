# Event Planner

A full-stack event management application built with Next.js framework and PostgreSQL database, allowing users to create, manage, and organize their events with a simple clean interface.

## ->Features

- **User Authentication**: Secure sign-up/sign-in with credentials, Google, and GitHub OAuth
- **Event Management**: Full CRUD operations for events (Create, Read, Update, Delete)
- **Event Types**: Conference, Workshop, Social, and Other types
- **Filtering**: Filter by event type, location, search, and date
- **Sorting**: Sort events by date or location (ascending/descending)
- **Pagination**: Browse events with smooth pagination
- **Upcoming Events**: View upcoming events on the dashboard page
- **Responsive Design**: Mobile-friendly interface

## ->Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.5.4 with App Router
- **Frontend**: [React](https://react.dev/) 19.1.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) 6.16.3
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) 4.24.11
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components**: [Headless UI](https://headlessui.com/)
- **Build Tool**: Turbopack
- **Linting**: [ESLint](https://eslint.org/) 9
- **Package Manager**: npm


## -Database Schema

### User Model
- `id`: String (Primary Key, CUID)
- `email`: String (Unique)
- `password`: String (Optional for OAuth users)
- `events`: Event[] (Relation)

### Event Model
- `id`: Int (Primary Key, Auto-increment)
- `eventName`: String
- `eventType`: Enum (CONFERENCE, WORKSHOP, SOCIAL, OTHER)
- `eventDate`: DateTime
- `eventTime`: DateTime
- `location`: String
- `description`: String (Optional)
- `userId`: String (Foreign Key to User)
- `user`: User (Relation)

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/event_planner"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # GitHub OAuth (optional)
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Open Prisma Studio to view/edit data
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

## -Authentication Flow

1. **Credentials Auth**: Email/password stored securely with bcrypt hashing
2. **OAuth Providers**: Google and GitHub single sign-on
3. **Session Management**: JWT-based sessions with NextAuth
4. **Protected Routes**: Dashboard and event pages require authentication

## -API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/signout` - Sign out user

### Events
- `GET /api/events` - Get all events (with filters, pagination)
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get single event
- `PATCH /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

## -Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- OAuth credentials (if present)

## -References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

