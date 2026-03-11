# 🚀 QUICK REFERENCE - Admin Panel Login & Signup

## ⚡ 60-Second Setup

```bash
# Terminal 1 - Start Server
cd server
npm run dev

# Terminal 2 - Start Admin Panel
cd admin
npm run dev

# Browser
# Visit: http://localhost:3001
```

---

## 🎯 First Time Usage

### Step 1: Create Admin Account

1. Click **"Create Account"** button
2. Fill in form:
   - Email: `your-email@lords-salon.com`
   - Password: `SecurePassword123` (min 8 chars)
   - Name: `Your Name`
   - Role: `Owner`
3. Click **"Create Account"**

### Step 2: Login

- Automatically logged in after signup
- See dashboard with menu

### Step 3: Manage Admins (Owner Only)

- Click **"Admins"** in sidebar
- Click **"Add Admin"** to add more accounts
- Compare with your team members

---

## 🔑 Key Features at a Glance

| Feature           | Owner | Manager |
| ----------------- | ----- | ------- |
| Login/Signup      | ✅    | ✅      |
| Dashboard         | ✅    | ✅      |
| Services          | ✅    | ✅      |
| Portfolio         | ✅    | ✅      |
| **Manage Admins** | ✅    | ❌      |

---

## 📍 Important URLs

| What        | URL                     |
| ----------- | ----------------------- |
| Admin Panel | `http://localhost:3001` |
| Server API  | `http://localhost:5000` |
| MongoDB     | Local or Atlas          |

---

## 🔐 Default Test Credentials

After signup, use your created credentials:

- Email: `your-email@lords-salon.com`
- Password: `SecurePassword123`

---

## ⚙️ Environment Variables

**server/.env:**

```
MONGODB_URI=mongodb://localhost:27017/lords-salon
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
```

**admin/.env.local:**

```
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Common Commands

```bash
# Start development servers
npm run dev

# Start only server
cd server && npm run dev

# Start only admin panel
cd admin && npm run dev

# Build for production
npm run build

# Seed initial admin (if needed)
node server/scripts/seedAdmin.js
```

---

## 🚨 Troubleshooting Quick Fixes

| Problem                    | Solution                              |
| -------------------------- | ------------------------------------- |
| Can't login                | Clear browser cache, try signup again |
| Port already in use        | `PORT=5001 npm run dev`               |
| MongoDB connection error   | Make sure MongoDB is running          |
| "Email already registered" | Use different email                   |
| Blank dashboard            | Refresh page, check server logs       |

---

## 📱 Admin Panel Navigation

```
┌─ Dashboard (Overview)
├─ Services (Manage salon services)
├─ Portfolio (Photo gallery)
└─ Admins (Owner only - manage team)
```

---

## 👥 Adding Team Members

**As Owner:**

1. Go to **Admins** section
2. Click **"Add Admin"**
3. Enter name, select role
4. Click **"Save Admin"**
5. Share login with team member
6. They can signup/login separately

---

## 🔓 Logout

Click **"Logout"** button in top-right corner

- Clears session
- Returns to login page
- Keeps account active for next login

---

## 📞 API Endpoints (For Reference)

```
POST   /api/auth/signup      → Create account
POST   /api/auth/login       → Login
GET    /api/auth/me          → Current admin
GET    /api/auth/admins      → List admins (owner)
PATCH  /api/auth/admins/:id  → Edit admin (owner)
DELETE /api/auth/admins/:id  → Delete admin (owner)
```

---

## ✨ Features Implemented

✅ Email & password authentication
✅ Account signup/login toggle
✅ Role-based access (Owner/Manager)
✅ Admin management dashboard
✅ Add/edit/delete admin accounts
✅ JWT token-based security
✅ Password hashing with bcrypt
✅ MongoDB integration
✅ Error handling & validation
✅ Dark theme UI

---

## 📊 Status Check

Run this in browser console to verify setup:

```javascript
// Check token
localStorage.getItem("adminToken") ? "✅ Logged in" : "❌ Not logged in";

// Check API
fetch("http://localhost:5000/api/auth/me", {
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
});
```

---

## 🎓 Learning Resources

- **ADMIN_LOGIN_SETUP.md** - Full API documentation
- **ADMIN_SETUP_CHECKLIST.md** - Step-by-step setup
- **ADMIN_IMPLEMENTATION_SUMMARY.md** - Complete overview
- **server/routes/auth.js** - Backend code
- **admin/src/pages/LoginPage.jsx** - Frontend code

---

## ❓ FAQ

**Q: Can I change my password?**
A: Not yet - coming in future update. Admin can delete and you create new account.

**Q: What if I forget my password?**
A: Use "Create Account" to make new account or ask owner to reset via admin panel.

**Q: Can managers add new admins?**
A: No, only owners can manage admin accounts. Managers can use services/portfolio.

**Q: Is it secure?**
A: Yes! Uses JWT tokens, bcrypt hashing, and role-based access control.

**Q: How many admins can I add?**
A: Unlimited. Add as many team members as needed.

---

## 🎉 Ready!

Your admin panel is fully configured. Start managing Lords Salon!

```
🌟 Login → Dashboard → Manage Services/Portfolio/Admins → Success!
```

---

**Questions? Check the full documentation files or review the code comments.**
