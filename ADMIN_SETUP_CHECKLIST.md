# Admin Panel Setup Checklist

## ✅ Prerequisites

- [ ] Node.js installed (v16 or higher)
- [ ] MongoDB running locally or Atlas connection configured
- [ ] Server running on port 5000 (or configured port)
- [ ] Admin client on port 3001 (or configured port)

## ✅ Server Setup (.env file)

Create a `.env` file in the `server/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lords-salon
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lords-salon

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Port (optional)
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3001

# Environment
NODE_ENV=development
```

## ✅ Admin Panel Setup (.env.local file)

Create a `.env.local` file in the `admin/` directory:

```env
VITE_API_URL=http://localhost:5000
```

## ✅ Database Initialization

### Option 1: Manual Setup via API

1. Start your server: `npm run dev` (from server folder)
2. Start admin panel: `npm run dev` (from admin folder)
3. Navigate to admin panel (http://localhost:3001)
4. Click "Create Account" and register your first admin
5. Set role to "Owner"
6. Complete signup

### Option 2: Seed Database (Advanced)

Create a script `server/scripts/seedAdmin.js`:

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await Admin.findOne({
      email: "owner@lords-salon.com",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new Admin({
      email: "owner@lords-salon.com",
      password: "ChangeMe123456",
      name: "Salon Owner",
      role: "owner",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    console.log("📧 Email: owner@lords-salon.com");
    console.log("🔑 Password: ChangeMe123456");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
```

Run with: `node server/scripts/seedAdmin.js`

## ✅ Installation Steps

1. **Install Server Dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Install Admin Dependencies**

   ```bash
   cd admin
   npm install
   ```

3. **Configure Environment Variables**
   - Create `.env` in server folder
   - Create `.env.local` in admin folder
   - (See above for template)

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or ensure MongoDB Atlas is accessible
   ```

5. **Start Server**

   ```bash
   cd server
   npm run dev
   ```

6. **Start Admin Panel** (in new terminal)
   ```bash
   cd admin
   npm run dev
   ```

## ✅ First Login Flow

1. Visit http://localhost:3001
2. You'll see the login page
3. Click "Create Account"
4. Fill in:
   - Email: Your email
   - Password: Strong password (min 8 chars)
   - Name: Your name
   - Role: Owner
5. Click "Create Account"
6. You'll be automatically logged in
7. Dashboard appears

## ✅ Features Available After Login

### Dashboard

- Overview of admin panel
- Welcome message with admin info

### Services Manager

- Add/edit/delete services
- Manage service details

### Portfolio Manager

- Add/edit/delete portfolio items
- Upload images

### Admins (Owner Only)

- View all admin accounts
- Add new admin accounts
- Edit admin details
- Deactivate/activate admins
- Delete admin accounts

## ✅ User Roles & Permissions

### Owner

- ✅ Full access to all features
- ✅ Manage admin accounts
- ✅ Edit all services
- ✅ Edit all portfolio items
- ✅ View system settings

### Manager

- ✅ Manage services
- ✅ Manage portfolio
- ❌ Cannot manage admin accounts
- ❌ Cannot access system settings

## ✅ Testing Credentials

After first setup, you can:

1. Create multiple admin accounts through signup
2. Use the "Admins" section to manage them
3. Log in/out with different accounts

Test flow:

1. Create Owner account → Login ✅
2. Create Manager account → Login ✅
3. As Owner, visit Admins section → See both accounts ✅
4. Try accessing Admins as Manager → Should be restricted ✅

## ✅ Troubleshooting

### Server won't start

```
# Check if port 5000 is already in use
# Error: listen EADDRINUSE :::5000

# Solution: Kill process or use different port
PORT=5001 npm run dev
```

### Can't connect to MongoDB

```
# Error: MongooseError: connect ECONNREFUSED

# Check MongoDB is running:
# Mac: brew services list
# Windows: Services (mongod)
# Linux: sudo systemctl status mongod

# Or check Atlas connection string
```

### JWT errors

```
# Error: Unauthorized - Invalid token

# Clear browser storage:
# 1. Open DevTools (F12)
# 2. Application → LocalStorage
# 3. Clear all
# 4. Log back in
```

### Signup email already registered

```
# Solution: Use different email or seed new database

# Reset database (MongoDB):
# mongo
# > use lords-salon
# > db.admins.deleteMany({})
```

## ✅ Security Considerations

⚠️ **Important for Production:**

1. Change JWT_SECRET to a strong, random value
2. Use HTTPS for all connections
3. Enable MongoDB authentication
4. Set secure cookies for JWT
5. Implement rate limiting on auth endpoints
6. Add email verification for new accounts
7. Implement password reset functionality
8. Enable 2FA for owner accounts
9. Log all admin actions
10. Regular security audits

## ✅ Next Deployment Steps

1. Build admin panel: `npm run build` (from admin/)
2. Deploy to Vercel/Netlify/hosting service
3. Update VITE_API_URL to production server
4. Set strong JWT_SECRET in production .env
5. Configure MongoDB Atlas with IP whitelist
6. Test all auth flows in production
7. Set up monitoring and logging

## ✅ Support & Documentation

- See ADMIN_LOGIN_SETUP.md for detailed API docs
- Check server/routes/auth.js for endpoint code
- Review admin/src/pages/LoginPage.jsx for frontend
- MongoDB docs: https://docs.mongodb.com/
- JWT docs: https://jwt.io/

---

**Ready to go! 🚀**

Start the servers and visit your admin panel to begin managing Lords Salon!
