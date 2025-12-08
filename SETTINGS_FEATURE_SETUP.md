# Settings Feature Setup Instructions

## Overview
A new **Settings** feature has been added for Admin users only. This feature includes:
- **Maintenance Mode** toggle (ON/OFF)
- Custom maintenance message configuration
- Admin-only access control

## Files Created

### 1. Navigation Menu (✅ DONE)
- **File**: `config/navigationItemConfig.js`
- **Changes**: Added Settings menu item with HiOutlineCog icon
- The Settings menu appears at the bottom of the admin sidebar

### 2. API Route (⚠️ NEEDS MANUAL SETUP)
- **Location**: `app/api/settings/route.js`
- **Content**: See `settings_api_route.txt` for the complete code
- **Methods**: 
  - `GET /api/settings` - Fetch current settings
  - `PATCH /api/settings` - Update settings (maintenance mode & message)

### 3. Settings Page (⚠️ NEEDS MANUAL SETUP)
- **Location**: `app/(admin)/adm/settings/page.js`
- **Content**: See `settings_page.txt` for the complete code
- **Features**:
  - Toggle switch for maintenance mode
  - Textarea for custom maintenance message
  - Real-time updates with React Query
  - Toast notifications for success/error states

## Setup Instructions

### Step 1: Create Directories
You need to manually create these directories:

```bash
# For Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "app\api\settings"
New-Item -ItemType Directory -Force -Path "app\(admin)\adm\settings"

# For Windows (Command Prompt)
mkdir app\api\settings
mkdir app\(admin)\adm\settings
```

### Step 2: Create API Route
1. Navigate to `app/api/settings/`
2. Create file `route.js`
3. Copy content from `settings_api_route.txt` (lines 3-91)

### Step 3: Create Settings Page
1. Navigate to `app/(admin)/adm/settings/`
2. Create file `page.js`
3. Copy content from `settings_page.txt` (lines 3-173)

### Step 4: Run Prisma Migration
The `AppSettings` model already exists in `prisma/schema.prisma` but needs to be applied to the database:

```bash
npx prisma migrate dev --name add_app_settings
```

If migration fails or AppSettings table already exists, you can skip migration and just regenerate Prisma client:

```bash
npx prisma generate
```

### Step 5: Test the Feature
1. Start dev server: `npm run dev`
2. Login as Admin
3. Navigate to **Pengaturan** in the sidebar
4. Test toggling maintenance mode ON/OFF
5. Test updating the maintenance message

## Database Schema

The `AppSettings` model is already defined in your schema:

```prisma
model AppSettings {
  id                String   @id @default("settings_main") @db.VarChar(50)
  maintenanceMode   Boolean  @default(false)
  maintenanceMessage String? @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

- **Single Record**: Only one settings record with ID `settings_main`
- **maintenanceMode**: Boolean flag for ON/OFF
- **maintenanceMessage**: Custom message shown during maintenance

## API Endpoints

### GET /api/settings
**Auth**: Admin only  
**Response**:
```json
{
  "id": "settings_main",
  "maintenanceMode": false,
  "maintenanceMessage": "Sistem sedang dalam pemeliharaan...",
  "createdAt": "2025-11-24T09:00:00.000Z",
  "updatedAt": "2025-11-24T09:00:00.000Z"
}
```

### PATCH /api/settings
**Auth**: Admin only  
**Request Body**:
```json
{
  "maintenanceMode": true,
  "maintenanceMessage": "Custom maintenance message"
}
```
**Response**: Same as GET response with updated values

## Security Notes

- ✅ Admin-only access enforced in API route
- ✅ Single record design prevents data inconsistency
- ✅ Uses upsert to handle missing settings gracefully
- ✅ Protected by `getAuthenticatedUser()` middleware

## UI Features

- **Toggle Switch**: Visual ON/OFF switch for maintenance mode
- **Real-time Updates**: Uses React Query for instant UI updates
- **Dark Mode**: Full dark mode support
- **Toast Notifications**: Success/error feedback
- **Warning Banner**: Shows when maintenance mode is active
- **Info Card**: Helpful information about maintenance mode behavior

## Future Enhancements

Consider adding:
- Email notification settings
- System-wide announcements
- Backup settings
- Theme customization
- Rate limiting configuration
- File upload size limits

## Troubleshooting

### PowerShell Not Available
If you encounter PowerShell errors, you can:
1. Use File Explorer to manually create the directories
2. Use Command Prompt instead
3. Use your code editor to create folders

### Prisma Migration Issues
If migration fails:
```bash
# Check current migrations
npx prisma migrate status

# Force reset (development only!)
npx prisma migrate reset

# Or manually apply
npx prisma db push
```

### Settings Not Loading
Check:
1. API route exists at correct path
2. Database migration applied
3. Logged in as ADMIN role
4. Check browser console for errors

## Clean Up

After successful setup, you can delete these temporary files:
- `settings_api_route.txt`
- `settings_page.txt`
- `create_dirs.bat` (if created)
- `create_dirs.js` (if created)
- `SETTINGS_FEATURE_SETUP.md` (this file)
