# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**e-Lapor Kab Kupang** is a Next.js-based public complaint reporting system with role-based access control. It enables citizens (PELAPOR) to file complaints, OPD (government agencies) to handle and respond to complaints, Admins to manage the system, and the Bupati (regent) to oversee operations.

**Tech Stack:**
- Next.js 15.5.6 with App Router
- PostgreSQL with Prisma ORM
- JWT authentication
- Tailwind CSS + Flowbite components
- React Query, React Hook Form, Zod validation

## Development Commands

```bash
# Start development server (generates Prisma client, runs Next.js on port 3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npx prisma generate              # Generate Prisma client
npx prisma migrate dev           # Create and apply new migration
npx prisma migrate deploy        # Apply pending migrations
npx prisma db push              # Sync schema with database (dev only)
npx prisma studio              # Open Prisma Studio GUI
```

## Architecture Overview

### Directory Structure

```
app/                          # Next.js App Router
├── (admin)/                  # Admin dashboard routes
├── (masyarakat)/            # Citizen portal routes (PELAPOR)
├── (bupati)/                # Bupati oversight portal
├── (org-perangkat-daerah)/  # OPD management portal
├── (public)/                # Public routes (auth, landing)
└── api/                      # API routes
    ├── auth/                 # Authentication (login, me, logout)
    ├── reports/             # Report CRUD operations
    ├── notifications/       # Notification system
    ├── opd/                 # OPD staff management
    ├── bugs/                # Bug reporting
    └── [other endpoints]

features/                     # Feature-specific React components
├── auth/                     # Login, registration, reset password
├── pengaduan/               # Report creation and details (role-based)
├── dashboard/               # Role-specific dashboards
├── chat/                    # Real-time chat between roles
├── kelola-organisasi...     # OPD management
└── [feature folders]

components/                  # Reusable UI components
├── partials/               # Layout components (header, sidebar, etc.)
├── ui/                     # Basic UI components
└── admin/, charts/, etc.   # Feature-specific components

lib/                        # Core utilities
├── auth.js                # JWT handling & user normalization
├── prisma.js             # Prisma client singleton
├── encryption.js         # NIK encryption/decryption
└── [helpers]

services/                   # Business logic & API calls
├── opdService.js         # OPD-related operations
└── [other services]

utils/                     # Utility functions
├── mask.js              # Masking sensitive data (NIK)
└── common.js            # Common helpers
```

### Role-Based Access Control

The system has **4 roles** with different permissions:

1. **PELAPOR** (Citizen)
   - File complaints via `/pengaduan/create`
   - Track complaint status
   - Chat with assigned OPD
   - View dashboard at `/dashboard`
   - Routes: `app/(masyarakat)/`

2. **OPD** (Government Agency Staff)
   - Handle assigned reports
   - Provide responses and updates
   - Manage staff and profile
   - Chat with citizens and Bupati
   - Routes: `app/(org-perangkat-daerah)/` (though accessed via (masyarakat) currently)

3. **ADMIN** (System Administrator)
   - Manage all reports
   - Manage OPDs and users
   - System configuration
   - Routes: `app/(admin)/`

4. **BUPATI** (Regent)
   - Oversight of all operations
   - View statistics and compliance
   - Final approval authority
   - Routes: `app/(bupati)/`

Role is determined by the `role` field in the User model and passed via JWT token.

## Database Schema Key Points

### ID Format Migration

The database recently migrated from **integer auto-increment IDs** to **UUID string IDs**:

```javascript
// Old format (deprecated but handled): id: 1, 2, 3...
// New format: id: "usr_550e8400-e29b-41d4-a716-446655440000"
```

**Critical:** The `lib/auth.js` file contains `normalizeUserData()` which automatically converts integer IDs from old tokens to strings. Both old and new formats work transparently.

### Core Models

- **User**: id (String UUID), name, email, password (bcrypt), role, opdId (for OPD staff)
- **OPD**: id (String UUID), name, staff (User[]), notifications
- **Report**: id (String UUID), userId, opdId, status (PENDING/PROSES/SELESAI/DITOLAK), bupatiStatus, opdStatus
- **Notification**: id (String UUID), userId, opdId, message, isRead
- **ChatRoom/ChatMessage**: Real-time communication between roles
- **BugReport**: System bug tracking separate from citizen complaints

See `prisma/schema.prisma` for complete schema.

## Authentication & API Routes

### Authentication Flow

1. **Login** (`POST /api/auth/login`): Email/NIK + password → JWT token in HttpOnly cookie
2. **Verify** (`GET /api/auth/me`): Returns current user data with role and OPD info
3. **Protected Routes**: Use `getAuthenticatedUser(req)` to verify JWT from header or cookie

### Important Auth Details

- JWT tokens are created in `app/api/auth/login/route.js`
- All API routes should call `getAuthenticatedUser(req)` first (returns null if unauthorized)
- Auth helper in `lib/auth.js` handles both Bearer tokens and cookies
- User IDs in JWT are automatically normalized from int to string

### Key API Endpoints

```
Authentication:
  POST   /api/auth/login          # Login with email/NIK + password
  GET    /api/auth/me             # Get current authenticated user
  POST   /api/auth/logout         # Logout

Reports:
  GET    /api/reports             # List reports (filtered by role)
  POST   /api/reports             # Create new report
  GET    /api/reports/[id]        # Get report details
  PATCH  /api/reports/[id]/status # Update report status

OPD:
  GET    /api/opd/[id]            # Get OPD details
  GET    /api/opd/staff-profile   # Get logged-in OPD staff profile
  POST   /api/opd/create          # Create new OPD

Notifications:
  GET    /api/notifications       # List user notifications
  POST   /api/notifications       # Create notification
  PATCH  /api/notifications       # Mark as read

Chat:
  GET    /api/opd/chat/rooms      # List chat rooms
  POST   /api/[role]/chat/send-message  # Send message
```

## Important Implementation Details

### Error Handling in API Routes

Always wrap Prisma calls in try-catch and return appropriate status codes:

```javascript
try {
  // Prisma operations
  return NextResponse.json(data, { status: 200 });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { error: 'User-friendly error message' },
    { status: 500 }
  );
}
```

### Notification System

The Notification model stores notifications for both PELAPOR (via userId) and OPD (via opdId):
- **For PELAPOR**: Query by `userId`
- **For OPD**: Query by `opdId` (the OPD ID the user is staff of)
- **For ADMIN/BUPATI**: Get all notifications

Recent schema change: userId and opdId converted from Int to String to match UUID format.

### Data Security

- Passwords: Hashed with bcrypt (5.1.1)
- NIK (National ID): Encrypted/decrypted with `lib/encryption.js`
- Sensitive data masked in responses using `utils/mask.js`
- HttpOnly cookies for JWT (cannot be accessed via JavaScript)

## Common Tasks

### Adding a New API Endpoint

1. Create route file: `app/api/[feature]/route.js`
2. Implement handler: `export async function GET/POST/PATCH/DELETE(req)`
3. Authenticate: `const user = await getAuthenticatedUser(req)`
4. Use Prisma: `const result = await prisma.model.operation(...)`
5. Error handling: Wrap in try-catch

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Review generated migration SQL
4. Commit both schema and migration files

### Adding Role-Based Features

1. Check user role: `if (user.role === 'PELAPOR') { ... }`
2. Create role-specific routes in appropriate folder: `app/(masyarakat)/`, `app/(admin)/`, etc.
3. Fetch role-specific features in API routes based on `user.role`

## Migration Notes

**Recent ID Migration (November 2025):**
- All integer IDs converted to UUID strings
- Migration files: `prisma/migrations/20251122*`
- Old tokens still work due to `normalizeUserData()` in `lib/auth.js`
- See `MIGRATION_GUIDE.md` for detailed information

## Configuration Files

- `.env`: Database URL, JWT secret, other environment variables
- `next.config.mjs`: Next.js build configuration
- `tailwind.config.mjs`: Tailwind CSS customization
- `jsconfig.json`: Path aliases (e.g., `@/` for root)
- `.eslintrc.json`: ESLint rules for code quality

## Known Issues & Workarounds

1. **Turbopack Configuration**: Warnings may appear about Webpack/Turbopack. Next.js handles this automatically.
2. **serverActions Config**: Some experimental features use non-standard format (see warnings in dev).
3. **Notification API**: Recently updated to use UUID IDs - ensure all notification creation includes string IDs.

## Testing Authentication

Quick endpoint to test your token:

```bash
# Shows current token status and user ID type
curl http://localhost:3000/api/test-auth

# Test with specific user
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/api/auth/me
```

## Performance Considerations

- React Query (`@tanstack/react-query`) used for data fetching and caching
- Images optimized with Next.js Image component
- PWA enabled with `next-pwa` (service workers, offline support)
- Turbopack for faster development rebuilds

## Next Steps When Joining

1. Run `npm install` then `npm run dev`
2. Review `MIGRATION_GUIDE.md` for database context
3. Check `app/(masyarakat)/` for citizen features
4. Check `app/(admin)/` for admin features
5. Look at `features/` folder for feature-specific components
6. Test authentication at `/api/test-auth`
