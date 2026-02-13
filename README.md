# Hackoverflow Check-in System

A Next.js 16+ application for managing participant check-ins at Hackoverflow 4.0.

## Architecture Overview

This project follows **senior-level Next.js best practices** with:

- ✅ **Server Components** by default (reduced client-side JavaScript)
- ✅ **Server Actions** instead of API routes (type-safe, secure mutations)
- ✅ **Strict TypeScript** with no `any` types
- ✅ **Zod validation** for runtime type safety
- ✅ **Rate limiting** for all server actions
- ✅ **Domain-driven folder structure** for scalability
- ✅ **Discriminated unions** for type-safe error handling

## Project Structure

```
Participant-portal/
├── actions/                  # Server Actions (replaces API routes)
│   ├── index.ts             # Centralized exports
│   ├── participants.ts      # Participant CRUD operations
│   ├── checkin.ts           # Check-in mutations
│   └── database.ts          # Database health checks
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (Server Component)
│   ├── page.tsx             # Home page (Server Component)
│   ├── HomePageClient.tsx   # Client interactivity island
│   └── checkin/
│       └── [participantId]/
│           └── page.tsx     # Dynamic check-in page
├── components/               # React Components
│   ├── index.ts             # Centralized exports
│   ├── participants/        # Participant-related components
│   ├── status/              # Status display components
│   └── ui/                  # Reusable UI primitives
├── lib/                      # Shared utilities & logic
│   ├── db/                  # Database layer
│   │   ├── index.ts         # Centralized exports
│   │   ├── mongodb.ts       # MongoDB connection singleton
│   │   └── participants.ts  # Participant DB operations
│   ├── types/               # TypeScript types & Zod schemas
│   │   ├── index.ts         # Centralized exports
│   │   ├── participant.ts   # Participant types & schemas
│   │   └── api-response.ts  # Response types (discriminated unions)
│   └── rate-limiter.ts      # In-memory rate limiting
└── public/                   # Static assets
```

## Key Features

### 1. Type-Safe Server Actions

All data operations use Server Actions with Zod validation:

```typescript
// actions/participants.ts
export async function getParticipantByIdAction(
  participantId: string
): Promise<ActionResult<ClientParticipant>> {
  // Rate limiting
  const rateLimitResult = actionRateLimiter.check(identifier);
  if (!rateLimitResult.allowed) {
    return createErrorResponse('Rate limited', 'RATE_LIMITED');
  }

  // Zod validation
  const parseResult = z.string().min(1).safeParse(participantId);
  if (!parseResult.success) {
    return createErrorResponse(parseResult.error.issues[0]?.message, 'VALIDATION_ERROR');
  }

  // Database operation
  const participant = await getParticipantById(parseResult.data);
  return { success: true, data: toClientParticipant(participant) };
}
```

### 2. Discriminated Union Responses

Type-safe error handling without exceptions:

```typescript
// lib/types/api-response.ts
export type ActionResult<T> = ActionSuccess<T> | ActionError;

interface ActionSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

interface ActionError {
  success: false;
  error: string;
  code?: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'DB_ERROR';
}
```

### 3. Rate Limiting

Sliding window rate limiting for all server actions:

```typescript
// lib/rate-limiter.ts
export const checkInRateLimiter = new RateLimiter({
  maxRequests: 10,    // 10 requests
  windowMs: 60 * 1000 // per minute
});
```

### 4. Server-First Rendering

Home page fetches data on the server:

```typescript
// app/page.tsx (Server Component)
export default async function HomePage() {
  const { connectionStatus, participants } = await getInitialData();
  
  return (
    <HomePageClient
      initialConnectionStatus={connectionStatus}
      initialParticipants={participants}
    />
  );
}
```

## Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=hackoverflow
```

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Database

Uses MongoDB with the following configuration:

- **Database**: `hackoverflow` (configurable via `DB_NAME`)
- **Collection**: `participants`

### Participant Schema

```typescript
interface DBParticipant {
  _id?: ObjectId;
  participantId: string;    // Unique ID
  name: string;
  email: string;
  phone?: string;
  role?: string;
  teamName?: string;
  institute?: string;
  labAllotted?: string;
  wifiCredentials?: {
    ssid?: string;
    password?: string;
  };
  collegeCheckIn?: {
    status: boolean;
    time?: Date;
  };
  labCheckIn?: {
    status: boolean;
    time?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Best Practices Implemented

| Practice | Implementation |
|----------|----------------|
| No `any` types | Strict TypeScript with `strict: true` |
| Runtime validation | Zod schemas for all inputs |
| Server-first rendering | Default to Server Components |
| Client islands | Minimal `'use client'` usage |
| Type-safe mutations | Server Actions with discriminated unions |
| Rate limiting | Per-IP sliding window limiter |
| Clean imports | Barrel exports from `@/actions`, `@/lib/types` |
| Error handling | Discriminated unions, not exceptions |
| Memory safety | Connection pooling, cleanup intervals |

## Security

- All server actions are rate-limited
- Input validation on all public functions
- Client IP extraction for rate limiting
- No sensitive data exposed to client

