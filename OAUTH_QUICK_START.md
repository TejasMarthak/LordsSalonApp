# Quick Start: Google OAuth Activation

## ⚡ TL;DR - 3 Steps to Enable Google OAuth

### Step 1: Get Google Credentials (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID (Web application)
3. Copy the **Client Secret** (you'll need this)

### Step 2: Configure Backend (2 minutes)

Edit `server/.env` and add:

```env
GOOGLE_OAUTH_CLIENT_SECRET=paste_your_client_secret_here
```

### Step 3: Restart and Test (2 minutes)

```bash
# Terminal 1: Restart backend
cd server && npm run dev

# Terminal 2: Admin panel should already be running
# If not: cd admin && npm run dev
```

Then:

1. Open `http://localhost:3002`
2. Click **"Continue with Google"**
3. Login with your Google account
4. ✅ Should redirect to dashboard

---

## ✅ What's Already Done

✅ All backend OAuth endpoints implemented
✅ Frontend OAuth components created
✅ Admin model updated for Google users
✅ API URLs standardized
✅ Google Maps fallback added
✅ @media query warning fixed

---

## 🔑 Environment Variables Needed

```bash
# server/.env - Backend needs these THREE variables:

GOOGLE_OAUTH_CLIENT_ID=1039867804900-9v2deo6v5l0311lo2v40008stn1m9fjs.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_from_google
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3002
```

**Frontend** (`admin/.env.local`) already has the Client ID set.

---

## 🚀 Testing OAuth

```
1. Open http://localhost:3002 in browser
2. Click "Continue with Google"
3. Login with your Google account
4. Consent to accessing email and profile
5. Should see "Signing you in..." spinner
6. Should redirect to dashboard
7. Check DevTools > Application > LocalStorage for 'adminToken'
```

---

## 🐛 Troubleshooting

### "OAuth not properly configured" Error

- [ ] Check `server/.env` has `GOOGLE_OAUTH_CLIENT_SECRET`
- [ ] Check value is not wrapped in quotes
- [ ] Restart backend server after adding to `.env`

### Redirect Loop

- [ ] Check URL shows `?code=...` parameter
- [ ] Clear localStorage: `localStorage.clear()` in console
- [ ] Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Failed to exchange authorization code"

- [ ] Verify Client ID and Secret are correct
- [ ] Check Google Cloud Console → Credentials page
- [ ] Verify OAuth app is enabled properly

---

## 📊 What Gets Created

When user logs in with Google:

- New Admin entry in database (if first time)
- Fields stored:
  - `email`: From Google
  - `name`: From Google
  - `googleId`: Unique Google identifier
  - `googleProfile.picture`: User's avatar URL
  - `role`: Default "manager" (change in code if needed)

---

## 📁 Key Files

**Backend**:

- `server/routes/auth.js` - OAuth endpoint at POST `/api/auth/oauth/google/callback`
- `server/models/Admin.js` - Updated for Google fields

**Frontend Admin**:

- `admin/src/pages/LoginPage.jsx` - Google redirect
- `admin/src/pages/OAuthCallback.jsx` - Handles callback
- `admin/src/App.jsx` - OAuth detection logic
- `admin/src/adminConfig.js` - API configuration

**Frontend Client**:

- `client/src/components/sections/LocationContact.jsx` - Maps fallback

---

## Next: Production Deployment

When ready for production:

1. Create new OAuth app in Google Cloud Console for production domain
2. Update `server/.env` with production credentials
3. Update `GOOGLE_OAUTH_REDIRECT_URI` to production domain
4. Update Google Cloud Console Authorized URIs to production domain
5. Ensure HTTPS is enabled on production

---

## Still Issues?

See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) for detailed guide.

For more info, check:

- [OAUTH_COMPLETE_STATUS.md](./OAUTH_COMPLETE_STATUS.md) - Full implementation details
- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
