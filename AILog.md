# AI Documentation

This file documents the main prompts and the resulting changes made by the AI assistant.

---

### Prompt 1: Initial Schema Generation

**Prompt:** "Act as a senior full-stack developer. Build an Event Planner application using Next.js, Prisma, and PostgreSQL. Generate the complete code for the `prisma/schema.prisma` file. It must include a User model (id,mail,password), Event Model->event name, event type - ENUM, date, time,type (offline/online), location) the user model and event both have reference to each other. set the data provider accordingly"

**Resulting Changes:**
- Created `prisma/schema.prisma` with `User` and `Event` models.
- The `Event` model included fields: `eventName`, `eventType`, `date`, `time`, `type`, `location`.

---

### Prompt 2: NextAuth.js API Route

**Prompt:** "Generate the code for the NextAuth.js API route located at `pages/api/auth/[...nextauth].js`. Include configurations for CredentialProvider, set up password hashing, JWT Token for session and also include callbacks to add user ID to the session token"

**Resulting Changes:**
- Installed `next-auth` and `bcrypt` dependencies.
- Created `src/app/api/auth/[...nextauth]/route.ts` with `CredentialsProvider`.
- Implemented password hashing with `bcrypt`.
- Configured JWT session with callbacks to include the user ID.

---

### Prompt 3: `.env.local` and Sign-in Page

**Prompt:** "create the env.local file i will replace the values later. Then move on to create the sign in page"

**Resulting Changes:**
- Created `.env.local` with placeholder `DATABASE_URL` and `NEXTAUTH_SECRET`.
- Created `src/app/auth/signin/page.tsx` with a basic sign-in form.

---

### Prompt 4: Events API Route (Initial Implementation)

**Prompt:** A detailed prompt to create the events API with GET and POST, pagination, filtering, etc.

**Resulting Changes:**
- Updated `prisma/schema.prisma` to modify the `Event` model with `eventDate`, `isPublic`, `totalBudget`, `guestCount`.
- Ran `prisma generate`.
- Created `src/app/api/events/route.ts` with `GET` and `POST` handlers implementing authentication, validation, pagination, and filtering.

---

### Prompt 5: Codebase Review and Rollback

**Prompt:** "read the codebase again and till now generate what all has been done. I rollbacked some changes and want to start from here"

**Resulting Changes:**
- The assistant analyzed the codebase and found that the events API and the sign-in page had been rolled back.
- A summary of the project's state was provided.
- An import issue in `src/app/api/auth/[...nextauth]/route.ts` was corrected.

---

### Prompt 6: Re-create Sign-in Page

**Prompt:** "create the signin page first"

**Resulting Changes:**
- Re-created the sign-in page at `src/app/auth/signin/page.tsx`.

---

### Prompt 7: Implement Sign-up Page

**Prompt:** "Implement the sign up/registration page too in cohesion with the sign in page (the button should toggle accordingly)"

**Resulting Changes:**
- Created the registration API route at `src/app/api/auth/register/route.ts`.
- Created the sign-up page at `src/app/auth/signup/page.tsx`.
- Added links to toggle between the sign-in and sign-up pages.

---

### Prompt 8: Create Events API

**Prompt:** "Generate the complete API route file at `pages/api/events/index.js`. The API must use NextAuth for authentication... (and all the other details)"

**Resulting Changes:**
- Updated `prisma/schema.prisma` to replace `date` and `time` with `eventDate` and remove `type` and `location`.
- Ran `prisma generate`.
- Created `src/app/api/events/route.ts` with `GET` and `POST` handlers implementing authentication, validation, pagination, and filtering.

---

### Prompt 9: Create Dashboard

**Prompt:** "I need to build the main dashboard for my event planner... (and all the other details)"

**Resulting Changes:**
- Created `components/events/EventCard.tsx` to display event details.
- Created `app/dashboard/page.tsx` as a server component to fetch and display events.
- The dashboard page fetches events from the API and displays them in a grid.
- It includes a "Create New Event" button.
- It handles the case where there are no events.
- Fixed issues with the `fetch` call and `Link` component in the dashboard page.

---