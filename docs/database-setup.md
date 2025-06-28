# Database Setup with Drizzle ORM

This project now uses Drizzle ORM for type-safe database operations with PostgreSQL (Neon).

## Setup

The database is configured with the following stack:
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Migration Tool**: Drizzle Kit

## Database Schema

### Tables

1. **users**
   - `id` (UUID, Primary Key)
   - `firebase_uid` (VARCHAR, Unique)
   - `email` (VARCHAR)
   - `name` (VARCHAR)
   - `age` (INTEGER, Optional)
   - `medical_condition` (TEXT, Optional)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **sensor_data**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to users)
   - `data_type` (VARCHAR) - 'eeg', 'ecg', 'heartRate', 'bloodPressure', 'temperature'
   - `value` (DECIMAL)
   - `signal_quality` (INTEGER, 0-100)
   - `metadata` (JSONB)
   - `timestamp` (TIMESTAMP)

3. **alerts**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to users)
   - `type` (VARCHAR) - 'critical', 'warning', 'info'
   - `title` (VARCHAR)
   - `description` (TEXT)
   - `status` (VARCHAR) - 'active', 'acknowledged', 'resolved'
   - `created_at` (TIMESTAMP)
   - `resolved_at` (TIMESTAMP, Optional)

## Available Scripts

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:push` - Push schema changes to the database
- `pnpm db:studio` - Open Drizzle Studio for database management

## Usage

All database operations are now type-safe and use the functions exported from `@/lib/database-drizzle`:

```typescript
import { createUser, getUserByFirebaseUid, insertSensorData } from "@/lib/database-drizzle";

// Create a new user
const user = await createUser({
  firebaseUid: "firebase_user_id",
  email: "user@example.com",
  name: "John Doe"
});

// Insert sensor data
const sensorData = await insertSensorData({
  userId: user.id,
  dataType: "heartRate",
  value: "75",
  signalQuality: 95
});
```

## Health Check

Visit `/api/health` to check database connectivity and table status.

## Migration History

- **Initial Migration**: Created users, sensor_data, and alerts tables with proper relationships and indexes
