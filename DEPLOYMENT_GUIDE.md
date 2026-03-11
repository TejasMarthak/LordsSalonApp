# Lords Professional Makeup Studio & Salon - Complete Deployment Guide

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
3. [Backend Deployment (Render/Railway)](#backend-deployment)
4. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [CORS Configuration](#cors-configuration)
7. [Post-Deployment](#post-deployment)

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account
- Git

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd Lords\ Salon
```

### Step 2: Install Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

#### Admin

```bash
cd ../admin
npm install
```

### Step 3: Create Environment Files

#### Server (.env)

```bash
cd server
cp ../.env.example .env
```

Edit `.env` with your local credentials:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lords-salon?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-in-production
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

#### Client (.env.local)

Create `client/.env.local`:

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_SALON_LAT=22.3072
VITE_SALON_LNG=73.1812
VITE_SALON_ADDRESS=Vadodara, Gujarat, India
VITE_SALON_PHONE=+91-XXXXXXXXXX
VITE_SALON_EMAIL=info@lords-salon.com
```

#### Admin (.env.local)

Create `admin/.env.local`:

```
VITE_API_URL=http://localhost:5000
```

### Step 4: Start Local Development Servers

Terminal 1 - Backend:

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 - Client:

```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

Terminal 3 - Admin:

```bash
cd admin
npm run dev
# Admin runs on http://localhost:3001
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose the Free tier
3. Select AWS as provider and closest region
4. Click "Create Cluster"

### Step 3: Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Click "Add User"

### Step 4: Configure Network Access

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
4. For production, use specific IPs

### Step 5: Get Connection String

1. Click "Databases" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Add `/lords-salon` before the query string

Example:

```
mongodb+srv://admin:password123@cluster.mongodb.net/lords-salon?retryWrites=true&w=majority
```

---

## 🚀 Backend Deployment (Render or Railway)

### Option A: Deploy to Render

#### Step 1: Prepare Repository

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

#### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render

#### Step 3: Create New Web Service

1. Dashboard → "New +" → "Web Service"
2. Connect to your GitHub repository
3. Fill in details:
   - **Name**: lords-salon-api
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.js`
   - **Node Version**: 18

#### Step 4: Add Environment Variables

1. In "Environment" section, add:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Generate a secure key
   - `NODE_ENV` - production
   - `CLIENT_PROD_URL` - Your client deployment URL
   - `ADMIN_PROD_URL` - Your admin deployment URL
   - Other variables from .env.example

#### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy
3. Get your service URL (e.g., `https://lords-salon-api.onrender.com`)

### Option B: Deploy to Railway

#### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project

1. Dashboard → "New Project"
2. Choose "GitHub Repo"
3. Select Lords Salon repository

#### Step 3: Add MongoDB Service

1. In project, click "Add Service"
2. Choose "MongoDB"
3. Configure database

#### Step 4: Configure Environment

1. Go to Variables tab
2. Add all required environment variables
3. Set `NODE_ENV=production`

#### Step 5: Deploy

1. Railway auto-deploys on push
2. Monitor deployment in Dashboard

---

## 🌐 Frontend Deployment (Vercel or Netlify)

### Option A: Deploy Client to Vercel

#### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub

#### Step 2: Import Project

1. Click "Add New..."
2. Select "Project"
3. Choose GitHub repository

#### Step 3: Configure Project

1. **Framework**: Vite
2. **Root Directory**: client
3. **Build Command**: `npm run build`
4. **Output Directory**: dist

#### Step 4: Set Environment Variables

In "Environment Variables":

```
VITE_API_URL=https://lords-salon-api.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-key
VITE_SALON_LAT=22.3072
VITE_SALON_LNG=73.1812
VITE_SALON_ADDRESS=Vadodara, Gujarat, India
VITE_SALON_PHONE=+91-XXXXXXXXXX
VITE_SALON_EMAIL=info@lords-salon.com
```

#### Step 5: Deploy

1. Click "Deploy"
2. Vercel builds and deploys automatically
3. Get your site URL (e.g., `https://lords-salon.vercel.app`)

### Option B: Deploy Admin to Vercel

#### Step 1: Create New Project

1. Same process as client
2. **Root Directory**: admin
3. **Build Command**: `npm run build`

#### Step 2: Set Environment Variables

```
VITE_API_URL=https://lords-salon-api.onrender.com
```

#### Step 3: Deploy

1. Click "Deploy"
2. Get your admin URL (e.g., `https://admin-lords-salon.vercel.app`)

### Deploying to Netlify

#### Step 1: Connect Repository

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site"
3. Select "Import an existing project"
4. Authorize GitHub

#### Step 2: Configure Build Settings

1. **Repository**: Lords Salon
2. **Branch**: main
3. **Build Command**: `npm run build`
4. **Publish Directory**: dist

#### Step 3: Set Environment Variables

1. Go to "Site settings" → "Build & deploy"
2. Add environment variables

#### Step 4: Deploy

1. Netlify builds and deploys
2. Get your site URL

---

## 🔐 Environment Variables

### Server (.env)

```
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lords-salon?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production
API_BASE_URL=https://lords-salon-api.onrender.com

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRY=7d

# Frontend URLs (CORS)
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
CLIENT_PROD_URL=https://lords-salon.vercel.app
ADMIN_PROD_URL=https://admin-lords-salon.vercel.app

# Maps
VITE_GOOGLE_MAPS_API_KEY=your-key-here

# Salon Info
SALON_NAME=Lords Professional Makeup Studio & Salon
SALON_PHONE=+91-XXXXXXXXXX
SALON_EMAIL=info@lords-salon.com
SALON_ADDRESS=Vadodara, Gujarat, India
SALON_LAT=22.3072
SALON_LNG=73.1812

# SEO Configuration
VITE_SITE_URL=https://lords-salon.vercel.app
SITE_DESCRIPTION=Professional makeup studio offering bridal, editorial, and party makeup services
SITE_KEYWORDS=makeup artist, bridal makeup, salon, beauty services
SITEMAP_PRIORITY=0.8
IMAGE_OPTIMIZATION_ENABLED=true
```

### Client (.env)

```
VITE_API_URL=https://lords-salon-api.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-key
VITE_SALON_LAT=22.3072
VITE_SALON_LNG=73.1812
VITE_SALON_ADDRESS=Vadodara, Gujarat, India
VITE_SALON_PHONE=+91-XXXXXXXXXX
VITE_SALON_EMAIL=info@lords-salon.com
```

---

## 🔒 CORS Configuration

The backend is pre-configured with CORS to accept requests from both frontends:

```javascript
// server/config/cors.js
const allowedOrigins = [
  process.env.CLIENT_URL, // http://localhost:3000
  process.env.ADMIN_URL, // http://localhost:3001
  process.env.CLIENT_PROD_URL, // https://lords-salon.vercel.app
  process.env.ADMIN_PROD_URL, // https://admin-lords-salon.vercel.app
];
```

**Important**: Update `CLIENT_PROD_URL` and `ADMIN_PROD_URL` in your production `.env` file once you deploy the frontends.

---

## 🔍 SEO Deployment Checklist

After deploying your application, verify these SEO features are working:

**Sitemap & Robots**

- [ ] Visit `https://yourdomain.com/sitemap.xml` - Should show XML sitemap
- [ ] Visit `https://yourdomain.com/sitemap-index.xml` - Should show sitemap index
- [ ] Visit `https://yourdomain.com/robots.txt` - Should display robot directives
- [ ] Submit sitemap to Google Search Console

**Meta Tags**

- [ ] View page source on homepage and check for `<title>`, `<meta name="description">`, `<canonical>`
- [ ] Verify Open Graph tags: `og:title`, `og:description`, `og:image`
- [ ] Check Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:image`

**Image Optimization**

- [ ] Check that images are served in WebP format (check Network tab)
- [ ] Verify JPEG fallbacks for older browsers
- [ ] Confirm images have responsive srcSet attributes
- [ ] Test lazy loading on slow connections (DevTools)

**JSON-LD Schema**

- [ ] View page source and find `<script type="application/ld+json">`
- [ ] Schemas should include: BeautySalon, Organization, Service, LocalBusiness
- [ ] Validate schema with [Google's Schema Markup Validator](https://validator.schema.org/)

**Performance**

- [ ] Run Google PageSpeed Insights - Aim for 90+ score
- [ ] Check Core Web Vitals in Google Search Console
- [ ] Monitor Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)

**For More Information**

- See [SEO_OPTIMIZATION_GUIDE.md](SEO_OPTIMIZATION_GUIDE.md) for detailed implementation
- See [SEO_IMPLEMENTATION_EXAMPLES.md](SEO_IMPLEMENTATION_EXAMPLES.md) for code examples
- See [SEO_INSTALLATION_GUIDE.md](SEO_INSTALLATION_GUIDE.md) for setup details

---

- [ ] MongoDB Atlas cluster is running
- [ ] Backend API is deployed and accessible
- [ ] Both frontend apps are deployed
- [ ] Environment variables are set correctly on all platforms
- [ ] CORS is configured with correct URLs
- [ ] Google Maps API key is valid
- [ ] Admin login works
- [ ] Services and portfolio can be created/edited/deleted
- [ ] Client website loads services and portfolio from API
- [ ] Maps integration shows correct location
- [ ] Email notifications are configured (optional)
- [ ] Database backups are enabled

**SEO Specific**

- [ ] Sitemap.xml is accessible and contains all services/portfolio
- [ ] robots.txt is properly configured
- [ ] Dynamic meta tags are generated on each page
- [ ] JSON-LD schemas are valid
- [ ] Images are optimized and loaded efficiently
- [ ] Page titles and descriptions are unique

---

## 🔗 Important URLs to Update

After deployment, update these files with your actual URLs:

1. **Admin Dashboard** (`admin\src\components\layout\AdminHeader.jsx`):
   - Update logout redirect URL

2. **Client Features** (`client\src\utils`):
   - Update API base URL references

3. **.env files**:
   - Update all production URLs
   - Keep development URLs for local testing

---

## 📞 Support & Troubleshooting

### Common Issues

**CORS Errors**

- Ensure frontend URLs are added to CORS whitelist in backend
- Restart backend after changing environment variables

**MongoDB Connection Failed**

- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**Deploy Fails**

- Check build logs for errors
- Ensure all dependencies are listed in package.json
- Verify Node.js version compatibility

---

## 🎉 You're Ready!

Your Lords Professional Makeup Studio & Salon platform is now live with enterprise-grade SEO optimization!

- Client: `https://lords-salon.vercel.app`
- Admin: `https://admin-lords-salon.vercel.app`
- API: `https://lords-salon-api.onrender.com`
- Sitemap: `https://lords-salon.vercel.app/sitemap.xml`

**Next Steps**: Follow [SEO_QUICKSTART_INDEX.md](SEO_QUICKSTART_INDEX.md) to verify and optimize your SEO implementation.
