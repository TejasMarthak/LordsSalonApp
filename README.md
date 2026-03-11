# 🎨 Lords Professional Makeup Studio & Salon

> A premium, minimalist full-stack MERN platform for a high-end salon and makeup studio.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://lords-salon.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Overview

Lords is a decoupled MERN (MongoDB, Express, React, Node.js) architecture designed specifically for a premium makeup studio. The platform features:

- **Client-Facing Website**: Aesthetic, mobile-first portal showcasing services and portfolio
- **Admin Dashboard**: Secure interface for complete content management
- **Contact & Business Info Management**: Control all contact details, hours, and social media from admin
- **Real-Time Update System**: Changes sync to website within 30 seconds
- **Unified API**: Single backend serving both frontends
- **MongoDB Database**: Scalable NoSQL storage
- **Google Maps Integration**: Custom, minimalist location display
- **Social Media Integration**: Professional SVG icons with direct links

## 🎯 Brand Identity

- **Vibe**: Quiet Luxury, Minimalism
- **Typography**: Playfair Display (headings) + Inter (body)
- **Color Palette**: Alabaster, cream, sage green, muted clay, stark black
- **Layout**: Wide margins, asymmetrical balance, smooth scrolling

## ✨ Key Features

### Admin Dashboard Features ✅

- **Contact Management**: Phone, email, address, map coordinates
- **Business Hours**: 7-day schedule with closed day support
- **Social Media Links**: Instagram, Facebook, WhatsApp, Twitter
- **Pages & Sections**: Full website content builder
- **Services**: Complete service catalog with categories
- **Portfolio**: Showcase your best work with local image uploads
- **Branding**: Customize colors and site appearance
- **Appearance Settings**: Global styling and theme management

### Website Features ✅

- **Dynamic Footer**: Contact info and social icons from admin panel
- **Location Section**: Interactive Google Maps with hours and contact
- **Responsive Design**: Optimized for all devices
- **Professional Icons**: SVG-based social media icons (not text badges)
- **Real-Time Updates**: Website reflects admin changes in 30 seconds

## 🏗️ Architecture

```
Lords Salon/
├── 📚 Documentation (12+ guides)
│   ├── INDEX.md                        ← START HERE for navigation
│   ├── README.md (this file)
│   ├── QUICK_START.md
│   ├── CONTACT_MANAGEMENT_GUIDE.md     ← NEW: Feature guide
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── SETUP_COMPLETE.md
│   ├── PROJECT_INVENTORY.md
│   ├── MAPS_INTEGRATION_GUIDE.md
│   └── SEO_*.md (5 guides for SEO optimization)
├── client/                  # Client-facing website (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     (Header, Footer - now with dynamic data)
│   │   │   ├── sections/   (Hero, Services, Lookbook, Location - responsive)
│   │   │   └── utils/      (SEO, OptimizedImage, Icons)
│   │   ├── hooks/          (useSiteData - API data fetching)
│   │   ├── utils/          (jsonLdSchema)
│   │   ├── pages/          (ServiceDetail, PortfolioDetail)
│   │   └── App.jsx
│   ├── index.html
│   └── tailwind.config.js
├── admin/                   # Owner's admin dashboard (React/Vite)
│   ├── src/
│   │   ├── components/    (Layout, Modules)
│   │   ├── pages/         (Login, Dashboard)
│   │   └── App.jsx
│   └── index.html
├── server/                 # Backend API (Express/Node)
│   ├── models/            (Mongoose schemas)
│   ├── routes/            (API endpoints + sitemap)
│   ├── middleware/        (Auth, CORS, etc.)
│   ├── config/            (Database, JWT, CORS)
│   ├── utils/             (Image optimization)
│   ├── public/            (robots.txt)
│   └── server.js
├── shared/                 # Shared utilities
└── .env.example           # Environment template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x
- MongoDB Atlas account
- Google Maps API key

### Local Development

1. **Start with [INDEX.md](INDEX.md)** - Navigation guide
2. **Follow [QUICK_START.md](QUICK_START.md)** - 30-second setup
3. **Then read [SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - What was built

### Additional Resources

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand system design
- **[MAPS_INTEGRATION_GUIDE.md](MAPS_INTEGRATION_GUIDE.md)** - Customize maps
- **[PROJECT_INVENTORY.md](PROJECT_INVENTORY.md)** - View all files
- **[SEO_QUICKSTART_INDEX.md](SEO_QUICKSTART_INDEX.md)** - SEO optimization

## 📦 Key Dependencies

### Server

- Express 4.18.2
- Mongoose 7.0.0
- jsonwebtoken 9.0.0
- bcryptjs 2.4.3
- CORS 2.8.5

### Client & Admin

- React 18.2.0
- Vite 4.4.5
- Tailwind CSS 3.3.2
- Axios 1.4.0

## 🗄️ Database Schema

### Service

```javascript
{
  name: String,
  category: Enum,
  description: String,
  price: Number,
  duration: Number (minutes),
  imageUrl: String,
  isActive: Boolean,
  featured: Boolean,
  timestamps: true
}
```

### PortfolioItem

```javascript
{
  title: String,
  category: Enum,
  description: String,
  imageUrl: String (required),
  beforeImageUrl: String,
  stylistId: ObjectId (ref: StaffMember),
  featured: Boolean,
  displayOrder: Number,
  timestamps: true
}
```

### StaffMember

```javascript
{
  name: String,
  role: Enum,
  bio: String,
  specializations: [String],
  imageUrl: String,
  experience: Number (years),
  available: Boolean,
  rating: Number (0-5),
  timestamps: true
}
```

### Admin

```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: Enum,
  isActive: Boolean,
  timestamps: true
}
```

## 🔐 Authentication

- **JWT-based** authentication for admin access
- **Secure password hashing** with bcryptjs
- **Token expiry**: 7 days (configurable)
- **Admin-only routes** protected by middleware

## 🗺️ Maps Integration

The client includes a customized Google Maps component featuring:

- Minimalist grayscale/neutral theme
- Custom SVG salon location marker
- Interactive info window
- Business hours display
- One-click phone call
- Responsive design

See `client/src/components/sections/LocationContact.jsx` for implementation.

## 🎨 Design System

### Colors

- **Primary**: Black (`#000000`), White (`#ffffff`)
- **Neutral**: Slate palette (50-950)
- **Accent**: Amber palette (for CTA)
- **Text**: Slate-950 (dark) / Slate-400 (light)

### Typography

- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, clean)

### Components

- Wide margins (24-48px)
- Generous spacing
- Smooth transitions (300-500ms)
- Hover states on interactive elements

## 📱 Responsive Design

All components are fully responsive:

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)

```bash
npm start
# Auto-deploys on git push
```

### Database (MongoDB Atlas)

- Managed cloud database
- Automatic backups
- Global CDN

**Full deployment guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📝 API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin (protected)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create (admin only)
- `PUT /api/services/:id` - Update (admin only)
- `DELETE /api/services/:id` - Delete (admin only)

### Portfolio

- `GET /api/portfolio` - Get all items
- `GET /api/portfolio/:id` - Get single item
- `POST /api/portfolio` - Create (admin only)
- `PUT /api/portfolio/:id` - Update (admin only)
- `DELETE /api/portfolio/:id` - Delete (admin only)

### Staff

- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create (admin only)
- `PUT /api/staff/:id` - Update (admin only)
- `DELETE /api/staff/:id` - Delete (admin only)

## 🔒 Security

- CORS configured for specific frontend URLs only
- JWT token-based authentication
- Bcrypt password hashing
- Environment variables for sensitive data
- Input validation on all routes
- Protected admin endpoints

## 🎯 Features

- ✅ Modern React functional components
- ✅ Tailwind CSS styling
- ✅ Google Maps integration
- ✅ Image upload support (Cloudinary/S3 ready)
- ✅ Admin content management
- ✅ Responsive design
- ✅ SEO-friendly
- ✅ Production-ready deployment

## 📝 Environment Variables

See [.env.example](.env.example) for complete list.

**Critical Variables**:

- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication secret
- `VITE_API_URL` - Backend URL for frontend
- `VITE_GOOGLE_MAPS_API_KEY` - Maps API key
- `CLIENT_PROD_URL` / `ADMIN_PROD_URL` - CORS whitelist

## 🛠️ Development

### Available Scripts

**Server**

```bash
npm run dev      # Development server with nodemon
npm start        # Production server
```

**Client & Admin**

```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 Performance

- Optimized React renders
- Code splitting with Vite
- Lazy loading images
- Efficient database queries
- GZIP compression enabled

## 🔄 Updates & Maintenance

- **Database**: MongoDB Atlas handles maintenance
- **Frontend**: One-click redeploys on Vercel
- **Backend**: Auto-deploys on git push (Render/Railway)
- **Content**: Admin dashboard for real-time updates

## 📞 Support

For deployment issues, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

For development questions, check component documentation in respective `/components` folders.

## 📄 License

MIT - Free to use and modify

## 🙏 Credits

Built with modern web technologies:

- React 18
- Express
- MongoDB
- Tailwind CSS
- Vite

---

**Ready to deploy?** Start with [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
