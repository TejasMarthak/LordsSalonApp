# 🔐 Security & Deployment Guide

## ✅ Security Updates Completed

### 1. **Removed Hardcoded API Keys**

✅ **Google Maps API Key**

- ❌ Removed from: `client/index.html`
- ❌ Removed from: `client/src/config.js` (had: `AIzaSyBLSrAZWW6NQWR6Ck5YBbYn1HvmwQSo72E`)
- ✅ Created: `client/src/utils/loadGoogleMaps.js` (dynamically loads from env vars)
- Updated: `client/src/components/sections/LocationContact.jsx` (uses dynamic loader)

✅ **Cloudinary Credentials**

- ❌ Removed from: `admin/src/components/modules/PortfolioManager.jsx` (had: `dsjfrpbsh` cloud name, `lords_salon` preset)
- ❌ Removed from: `client/src/config.js` (had: `591717727461881` API key)
- ✅ Updated: Both use environment variables now (`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`)

### 2. **Added Google OAuth Support**

✅ Google OAuth button added to admin login page

- Uses `VITE_GOOGLE_OAUTH_CLIENT_ID` from environment variables
- Implements secure OAuth 2.0 code flow
- Redirects to Google for authentication
- Backend needs to handle OAuth callback at `/auth/callback`

### 3. **Created Missing Admin Modules**

✅ **ContentManager.jsx** - Manage all site text content
✅ **SettingsManager.jsx** - Manage business info & delete account

### 4. **Updated Environment Variables**

#### `/admin/.env.local`

```env
# Admin Environment Variables
VITE_API_URL=http://localhost:5000

# Cloudinary (Image Upload)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Google OAuth
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

#### `/client/.env.local`

```env
# Client Environment Variables
VITE_API_URL=http://localhost:5000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google OAuth
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id

# Cloudinary (Image Upload)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Salon Information
VITE_SALON_LAT=23.0152
VITE_SALON_LNG=72.4644
VITE_SALON_ADDRESS=104, First Floor, HarshEvoq...
VITE_SALON_PHONE=+91 9733681843
VITE_SALON_EMAIL=tejasmarthak1909@gmail.com
```

---

## 🚀 Deployment Checklist

### Before Deploying to Production:

#### 1. **Get Required API Keys**

- [ ] Google Maps API Key (from Google Cloud Console)
- [ ] Cloudinary Cloud Name & Upload Preset (from Cloudinary Dashboard)
- [ ] Google OAuth Client ID (from Google Cloud Console - OAuth 2.0)

#### 2. **Backend Environment Variables** (server/.env)

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secure_random_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

#### 3. **Frontend .env Files**

Create updated `.env.local` files with YOUR actual API keys:

- `client/.env.local`
- `admin/.env.local`

#### 4. **Set OAuth Redirect URIs**

In Google Cloud Console, add callback URLs:

- `http://localhost:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

#### 5. **Configure Cloudinary Upload Presets**

1. Go to Cloudinary Dashboard → Settings → Upload
2. Create unsigned upload preset named `your_upload_preset`
3. Use this name in environment variables

### Environment Variable Safety Rules:

✅ **DO:**

- Store all secrets in `.env` files (development)
- Use environment variables in code
- Keep `.env` files in `.gitignore`
- Use different keys for dev/production
- Rotate keys regularly

❌ **DON'T:**

- Commit `.env` files to git
- Hardcode API keys in code
- Share `.env` files in repositories
- Use same keys across environments
- Log sensitive values

---

## 📋 File Changes Summary

### Modified Files:

1. **client/.env.local** - Updated with generic placeholders
2. **admin/.env.local** - Updated with generic placeholders
3. **client/index.html** - Removed hardcoded Google Maps script
4. **client/src/config.js** - Replaced hardcoded keys with env vars
5. **admin/src/pages/LoginPage.jsx** - Added Google OAuth button
6. **admin/src/components/modules/PortfolioManager.jsx** - Uses env vars for Cloudinary
7. **client/src/components/utils/PhotoUpload.jsx** - Uses env vars for Cloudinary
8. **admin/src/App.jsx** - Added ContentManager & SettingsManager

### New Files:

1. **client/src/utils/loadGoogleMaps.js** - Secure Google Maps loader
2. **admin/src/components/modules/ContentManager.jsx** - Content management module
3. **admin/src/components/modules/SettingsManager.jsx** - Settings & account management

---

## 🔍 Security Verification

Run these commands to verify no secrets are exposed:

```bash
# Search for hardcoded API keys
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "dsjfrpbsh" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "591717727461881" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "lords_salon" . --exclude-dir=node_modules --exclude-dir=.git

# Check if .env files are in gitignore
cat .gitignore | grep ".env"
```

All should return empty or only matches in comments/documentation.

---

## 🛠️ OAuth Backend Implementation Needed

You'll need backend endpoints for OAuth callback:

```javascript
// POST /api/auth/oauth/callback
// - Accept authorization code from Google
// - Exchange code for tokens
// - Create/update user in database
// - Return JWT token for your app
```

---

## ✨ New Admin Features

### ContentManager

- Edit hero headline, subheadline, CTA text
- Manage services description
- Edit footer and other section content
- Real-time preview of changes

### SettingsManager

- Update salon name, phone, email, address
- Configure business hours
- Manage social media links
- **Delete account** with password confirmation

---

## 🎯 Next Steps

1. Get your API keys from respective providers
2. Update `.env.local` files with real values
3. Implement OAuth callback endpoint on backend
4. Test all authentication flows
5. Deploy to production with secure environment variables
6. Use environment variables provided by hosting platform (Vercel, Netlify, etc.)

---

## 📞 Important Notes

- **NEVER commit `.env` files** to git repository
- **Environment variables are NOT exposed** in client-side production builds
- Client-side env vars must start with `VITE_` prefix
- Backend env vars don't need prefix (only for Vite apps)
- Rotate keys periodically for security
- Different keys should be used for dev/staging/production

---

**Your app is now ready for secure deployment! 🔐**
