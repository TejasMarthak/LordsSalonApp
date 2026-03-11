# Admin Login & Signup System Documentation

## Overview

The Lords Salon Admin Panel now includes a complete authentication system with signup and login capabilities, as well as admin account management for the salon owner.

## Features

### 1. **Login & Signup Interface**

The login page now includes:

- **Login Mode**: Existing admins can log in with email and password
- **Signup Mode**: New admins can create an account with:
  - Email
  - Password (minimum 8 characters)
  - Full Name
  - Role selection (Manager or Owner)
- Easy toggle between login and signup modes

### 2. **Admin Account Roles**

- **Owner**: Full access to all features including admin management
- **Manager**: Limited access to services and portfolio management

### 3. **Admin Management Dashboard** (Owner Only)

The "Admins" section in the sidebar allows owners to:

- View all admin accounts
- Add new admin accounts
- Edit existing admin details:
  - Name
  - Role (Owner/Manager)
  - Active status
- Delete admin accounts (except their own account)

## API Endpoints

All authentication endpoints are available at `/api/auth/`

### Signup

```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "admin@lords-salon.com",
  "password": "securepassword123",
  "name": "Admin Name",
  "role": "manager"  // or "owner"
}

Response:
{
  "message": "Admin account created successfully",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@lords-salon.com",
    "name": "Admin Name",
    "role": "manager"
  }
}
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@lords-salon.com",
  "password": "securepassword123"
}

Response:
{
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "email": "admin@lords-salon.com",
    "name": "Admin Name",
    "role": "manager"
  }
}
```

### Get Current Admin

```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "_id": "admin_id",
  "email": "admin@lords-salon.com",
  "name": "Admin Name",
  "role": "manager",
  "isActive": true,
  "createdAt": "2024-03-10T...",
  "updatedAt": "2024-03-10T..."
}
```

### Get All Admins (Owner Only)

```
GET /api/auth/admins
Authorization: Bearer {token}

Response: Array of admin objects
```

### Update Admin (Owner Only)

```
PATCH /api/auth/admins/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "owner",
  "isActive": true
}

Response: Updated admin object
```

### Delete Admin (Owner Only)

```
DELETE /api/auth/admins/:id
Authorization: Bearer {token}

Response:
{
  "message": "Admin deleted successfully"
}
```

## Admin Model Schema

The Admin model includes:

- `email` - Unique email address
- `password` - Hashed with bcrypt (min 8 characters)
- `name` - Admin's full name
- `role` - Either "owner" or "manager"
- `isActive` - Boolean to enable/disable account
- `timestamps` - createdAt and updatedAt

## Security Features

✅ **Password Hashing**: All passwords are hashed with bcrypt salt (10 rounds)
✅ **JWT Tokens**: Secure token-based authentication
✅ **Email Validation**: Unique email enforcement at database level
✅ **Role-Based Access Control**: Different permissions for owners and managers
✅ **Token Verification**: All protected routes verify JWT tokens

## How to Use

### First Time Setup

1. **Navigate to Admin Panel**
   - Go to `http://localhost:5173/admin` (or your configured domain)

2. **Create First Admin Account**
   - Click "Create Account" button
   - Fill in details:
     - Email: Your salon admin email
     - Password: Strong password (min 8 chars)
     - Name: Your name
     - Role: Select "Owner" for main admin
   - Click "Create Account"

3. **Login**
   - Use the same email and password to login
   - You'll be taken to the dashboard

### Adding More Admins (Owner Only)

1. **Navigate to Admin Management**
   - Click "Admins" in the sidebar
   - You'll see a list of all admins

2. **Add New Admin**
   - Click "Add Admin" button
   - Fill in the admin details:
     - Name: Their name
     - Role: Manager or Owner
     - Active: Check to enable
   - Click "Save Admin"
   - Note: The new admin needs to sign up with their email

3. **Edit Admin**
   - Click "Edit" on any admin
   - Update their details
   - Click "Update Admin"

4. **Delete Admin**
   - Click "Delete" on any admin (except your own)
   - Confirm the deletion
   - Admin account will be removed

## Environment Variables

Make sure your `.env` file in the server includes:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
JWT_EXPIRE=7d
```

## Frontend Integration

The admin panel includes:

### Components

- `LoginPage.jsx` - Combined login/signup interface
- `AdminManager.jsx` - Admin management dashboard (owner only)
- `AdminHeader.jsx` - Header with logout
- Updated `Sidebar.jsx` - Navigation with admin management link

### State Management

- Admin state stored in localStorage using JWT token
- Auto-login from saved token
- Logout clears token and redirects to login

## Troubleshooting

### "Email already registered"

- This email is already associated with an admin account
- Use a different email or reset the database

### "Invalid credentials"

- Check your email and password
- Ensure you haven't mistyped them
- Password is case-sensitive

### "Only owners can..."

- You're trying to perform an owner-only action as a manager
- Contact the salon owner to perform this action

### Token Errors

- Clear localStorage: `localStorage.clear()`
- Log out and log back in
- Check if server is running

## Database Setup

Ensure MongoDB is running and Atlas/local connection is configured.

First admin can be created through the signup interface, or seeded via:

```javascript
const Admin = require("./models/Admin");

const admin = new Admin({
  email: "owner@lords-salon.com",
  password: "InitialPassword123",
  name: "Salon Owner",
  role: "owner",
});

await admin.save();
```

## Next Steps

1. ✅ Set up your first admin account
2. ✅ Log in to the admin dashboard
3. ✅ Add team members as managers
4. ✅ Manage services and portfolio
5. ✅ Monitor bookings and staff

## Support

For any issues or questions about the admin system, check:

- Server logs in the terminal
- Browser console (F12)
- MongoDB connection status
- JWT secret configuration
