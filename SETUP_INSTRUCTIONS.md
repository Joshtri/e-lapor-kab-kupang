# 🔧 Settings Feature - Quick Setup Guide

## ✅ What's Already Done

1. **Navigation Menu Updated** - Settings menu item added to admin sidebar
2. **Schema Ready** - `AppSettings` model already exists in `prisma/schema.prisma`
3. **Setup Script Created** - `setup-settings.js` ready to run

## 🚀 Quick Setup (2 commands)

### Option 1: Automated Setup (Recommended)

```bash
# Step 1: Run setup script
node setup-settings.js

# Step 2: Generate Prisma client (or run migration if needed)
npx prisma generate

# Step 3: Start dev server
npm run dev
```

### Option 2: Manual Setup

If the script doesn't work, follow these steps:

#### 1. Create API Route
```bash
# Create directory
mkdir app\api\settings

# Create file: app\api\settings\route.js
# Copy content from: settings_api_route.txt
```

#### 2. Create Settings Page
```bash
# Create directory  
mkdir app\(admin)\adm\settings

# Create file: app\(admin)\adm\settings\page.js
# Copy content from: settings_page.txt
```

#### 3. Run Prisma
```bash
# If AppSettings table doesn't exist:
npx prisma migrate dev --name add_app_settings

# If table already exists:
npx prisma generate
```

## 📍 Where to Access

After setup, login as Admin and navigate to:
- **URL**: `http://localhost:3000/adm/settings`
- **Menu**: Click "Pengaturan" in the admin sidebar (bottom of the menu)

## 🎯 Features

- **Maintenance Mode Toggle**: ON/OFF switch for system maintenance
- **Custom Message**: Set message shown during maintenance
- **Admin Only**: Only admins can access and modify settings
- **Real-time Updates**: Changes reflect immediately
- **Dark Mode Support**: Fully styled for light and dark themes

## 🔒 Security

- ✅ Admin-only access enforced at API level
- ✅ JWT authentication required
- ✅ Single settings record (ID: `settings_main`)
- ✅ Upsert strategy prevents data loss

## 📝 API Endpoints

### GET /api/settings
Fetches current settings (Admin only)

### PATCH /api/settings
Updates settings (Admin only)

**Request body:**
```json
{
  "maintenanceMode": true,
  "maintenanceMessage": "System under maintenance"
}
```

## 🧪 Testing

1. Login as Admin
2. Navigate to Settings (`/adm/settings`)
3. Toggle maintenance mode ON
4. Update the maintenance message
5. Toggle maintenance mode OFF

## 🐛 Troubleshooting

### "Cannot find module '@/lib/auth'"
- Run: `npm install`
- Make sure you're in the project root

### "Table 'AppSettings' does not exist"
- Run: `npx prisma migrate dev --name add_app_settings`
- Or: `npx prisma db push`

### Settings page not loading
- Check if you're logged in as ADMIN
- Check browser console for errors
- Verify API route exists at `app/api/settings/route.js`

### PowerShell errors
- Use Command Prompt instead
- Or manually create directories in File Explorer

## 🗑️ Cleanup

After successful setup, you can delete:
- `setup-settings.js`
- `settings_api_route.txt`
- `settings_page.txt`
- `create_dirs.bat`
- `create_dirs.js`
- `SETTINGS_FEATURE_SETUP.md`
- `SETUP_INSTRUCTIONS.md` (this file)

## 📚 Files Modified/Created

### Modified:
- ✅ `config/navigationItemConfig.js` - Added settings menu item

### Created:
- ⏳ `app/api/settings/route.js` - API endpoint
- ⏳ `app/(admin)/adm/settings/page.js` - Settings page UI

## 🎉 Success Indicators

You'll know it's working when:
1. "Pengaturan" appears in admin sidebar
2. Clicking it loads the settings page
3. Toggle switch changes maintenance mode
4. Toast notifications appear on save
5. No console errors

---

**Need Help?** Check the console logs or API responses for detailed error messages.
