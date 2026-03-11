# Google OAuth Setup Guide

## Overview

The application now has a complete Google OAuth 2.0 implementation for admin authentication. This guide walks you through setting up and configuring Google OAuth.

## Prerequisites

1. Google Cloud Console account
2. A project created in Google Cloud Console
3. Both frontend and backend servers ready to accept connections

## Step 1: Get Google OAuth Credentials

### 1.1 Create OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **Credentials** in the left sidebar
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Set the following:
   - **Name**: "Lords Salon Admin"
   - **Authorized JavaScript origins**:
     - `http://localhost:3002` (development)
     - `http://localhost:3000` (production domain)
   - **Authorized redirect URIs**:
     - `http://localhost:3002` (development)
     - `http://localhost:3000` (production domain)

7. Click **Create**
8. Save your **Client ID** and **Client Secret**

### 1.2 Get Your Google OAuth Client ID

The Client ID is already configured in `admin/.env.local`:

```
VITE_GOOGLE_OAUTH_CLIENT_ID=1039867804900-9v2deo6v5l0311lo2v40008stn1m9fjs.apps.googleusercontent.com
```

## Step 2: Configure Backend Environment Variables

### 2.1 Update `server/.env`

Add the following variables:

```env
# Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID=1039867804900-9v2deo6v5l0311lo2v40008stn1m9fjs.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_from_google_console
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3002

# For production:
# GOOGLE_OAUTH_REDIRECT_URI=https://yourdomain.com
```

**Important**:

- Replace `your_client_secret_from_google_console` with the actual secret from Google
- For production, the redirect URI should match your deployment domain exactly
- The redirect URI in Google Console must match the `GOOGLE_OAUTH_REDIRECT_URI` environment variable

## Step 3: OAuth Flow Overview

### Frontend Flow (Admin Panel):

1. **Login Page** (`admin/src/pages/LoginPage.jsx`)
   - User clicks "Continue with Google"
   - JavaScript redirects to Google OAuth URL with:
     - `client_id`: Your Google Client ID
     - `redirect_uri`: `http://localhost:3002` (or production domain)
     - `scope`: `openid profile email`
     - `response_type`: `code` (authorization code flow)

2. **Google Redirect**
   - Google prompts user to login / consent
   - Google redirects back to `http://localhost:3002?code=AUTH_CODE&state=STATE`

3. **OAuth Callback** (`admin/src/pages/OAuthCallback.jsx`)
   - App detects the `code` query parameter
   - Displays "Signing you in..." spinner
   - Sends authorization code to backend

### Backend Flow:

1. **Token Exchange** (`/api/auth/oauth/google/callback`)
   - Receives authorization code from frontend
   - Exchanges code with Google's token endpoint for ID token
   - Decodes ID token to extract user info (email, name, picture)
   - Finds or creates Admin user in database
   - Generates JWT token for app authentication
   - Returns JWT and admin data to frontend

2. **Token Storage**
   - Frontend stores JWT in `localStorage['adminToken']`
   - Subsequent API requests include JWT in Authorization header

## Step 4: Testing OAuth Flow

### Test in Development:

1. Start all servers:

   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Admin panel
   cd admin && npm run dev
   ```

2. Open Admin Panel: `http://localhost:3002`

3. Click "Continue with Google"

4. You should be prompted to select/login to your Google account

5. After consent, you'll be redirected back to the admin dashboard

### Verify in Database:

After successful OAuth:

- New admin user should be created in MongoDB
- User should have `googleId` and `googleProfile.picture` fields
- User should be able to login without a password

## Step 5: API Endpoints

### POST `/api/auth/oauth/google/callback`

**Request:**

```json
{
  "code": "authorization_code_from_google",
  "state": "optional_state_parameter"
}
```

**Success Response (200):**

```json
{
  "message": "OAuth authentication successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "mongodb_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "manager",
    "picture": "https://..."
  }
}
```

**Error Responses:**

- **400**: Missing authorization code or email
- **401**: Failed to exchange code with Google
- **500**: OAuth not properly configured (missing env variables)

## Step 6: Security Considerations

### Production Checklist:

- [ ] Client Secret is never exposed to frontend (kept in backend .env only)
- [ ] HTTPS is enforced in production
- [ ] CORS is properly configured for your domain
- [ ] Google Console redirect URIs match exactly (no trailing slashes)
- [ ] JWT tokens are signed with a strong secret
- [ ] Implement token refresh logic if needed
- [ ] Add rate limiting on OAuth endpoint
- [ ] Validate all inputs on backend

### Current Implementation:

✅ Client Secret kept in backend only
✅ Authorization code exchange is server-to-server (secure)
✅ ID token is decoded on backend (not exposed to frontend)
✅ JWT token is generated for session management
✅ Admin role is assigned based on logic (adjustable in code)

## Step 7: Troubleshooting

### "OAuth not properly configured" Error

**Cause**: Missing environment variables in `server/.env`

**Solution**:

1. Check that `server/.env` has all three variables:
   - `GOOGLE_OAUTH_CLIENT_ID`
   - `GOOGLE_OAUTH_CLIENT_SECRET`
   - `GOOGLE_OAUTH_REDIRECT_URI`
2. Restart the backend server after adding variables
3. Check console logs for detailed error

### "Failed to exchange authorization code" Error

**Cause**: Mismatch between redirect URI or invalid credentials

**Solution**:

1. Verify `GOOGLE_OAUTH_REDIRECT_URI` matches Google Console exactly
2. Verify Client ID and Secret are correct and not expired
3. Ensure your Google Cloud project has the OAuth 2.0 API enabled
4. Check Google Cloud Console Credentials page for any restrictions

### Redirect Loop

**Cause**: OAuth callback is not being detected properly

**Solution**:

1. Open browser DevTools → Network tab
2. Check that the redirect URL has `?code=...` parameter
3. Refresh the browser and check the URL bar
4. Clear browser cache and localStorage
5. Check browser DevTools → Application → LocalStorage for stored tokens

## Step 8: Next Steps

### Recommended Enhancements:

1. **Add Google Logout**
   - Revoke Google token on logout
   - Clear localStorage JWT

2. **Add Account Linking**
   - Allow users to link Google account to existing email/password account
   - Check if email matches

3. **Add Refresh Token Logic**
   - Store refresh token in database
   - Automatically refresh JWT before expiration

4. **Add OAuth State Parameter**
   - Generate random state in LoginPage
   - Verify state in OAuthCallback
   - Prevents CSRF attacks

5. **Add Scope Consent Handling**
   - Handle incremental authorization for additional permissions
   - Show user what data will be accessed

## Reference Files Modified

### Frontend:

- `admin/src/pages/LoginPage.jsx` - OAuth redirect handler
- `admin/src/pages/OAuthCallback.jsx` - Callback handler
- `admin/src/App.jsx` - OAuth detection logic
- `admin/.env.local` - Google OAuth Client ID

### Backend:

- `server/routes/auth.js` - OAuth endpoints
- `server/models/Admin.js` - Google OAuth fields
- `server/.env` - OAuth credentials (needs configuration)

### Utilities:

- `admin/src/adminConfig.js` - API base URL configuration

## For Production Deployment

1. **Update Environment Variables**:

   ```env
   GOOGLE_OAUTH_CLIENT_ID=your_production_client_id
   GOOGLE_OAUTH_CLIENT_SECRET=your_production_secret
   GOOGLE_OAUTH_REDIRECT_URI=https://youradmin.lordssalon.com
   ```

2. **Update Google Console**:
   - Add production domain to Authorized JavaScript origins
   - Add production domain to Authorized redirect URIs
   - Keep development localhost URLs separate or use different OAuth app

3. **Update Admin Config**:
   - Change `apiConfig.baseUrl` to production domain in `admin/src/adminConfig.js`

4. **Enable HTTPS**
   - Google OAuth requires HTTPS for production
   - Use SSL certificates (Let's Encrypt or similar)

5. **Test Full Flow**
   - Test OAuth login on production
   - Verify JWT tokens work
   - Check database connections

---

**Need Help?** Check the implementation files or refer to [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
