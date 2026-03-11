# 🚀 DEPLOYMENT & CONFIGURATION GUIDE

## 📋 Overview

Lords Salon is a comprehensive, modern, secure MERN application with:

- **Minimalist luxury design** for professional beauty services
- **Secure API architecture** with zero hardcoded secrets
- **Admin panel** for complete business customization
- **Real-time updates** with mobile-responsive design
- **Minimalist SVG icons** throughout the application

---

## 🔐 SECURITY CHECKLIST

### ✅ API Keys & Secrets

- [x] All hardcoded API keys removed from source code
- [x] All credentials now load from environment variables
- [x] Server `.env` file uses generic placeholders in version control
- [x] `.env.example` created with template
- [x] Personal salon details removed from all components

### ✅ Environment Variables Setup

#### Server (.env)

```bash
# DATABASE
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# SERVER
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_random_32_char_secret_here
JWT_EXPIRY=7d

# CORS URLS
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
CLIENT_PROD_URL=https://your-domain.vercel.app
ADMIN_PROD_URL=https://admin.your-domain.vercel.app

# IMAGE STORAGE (Choose one)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# GOOGLE SERVICES
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# SALON INFO (Leave empty - admin sets these)
SALON_NAME=
SALON_PHONE=
SALON_EMAIL=
SALON_ADDRESS=
```

#### Client (.env.local)

```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
VITE_SALON_NAME=Your Salon Name
VITE_SALON_PHONE=Your Phone
VITE_SALON_EMAIL=your@email.com
VITE_SALON_ADDRESS=Your Address
VITE_SALON_LAT=23.0152
VITE_SALON_LNG=72.4644
VITE_WEBSITE_URL=http://localhost:3000
VITE_SALON_INSTAGRAM=https://instagram.com/yoursalon
VITE_SALON_FACEBOOK=https://facebook.com/yoursalon
VITE_SALON_WHATSAPP=https://wa.me/1234567890
VITE_SALON_YOUTUBE=https://youtube.com/yoursalon
```

#### Admin (.env.local)

```bash
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
```

---

## 🎨 DESIGN FEATURES

### ✅ Aesthetic, Minimal, Professional, Luxury Design

- **Minimalist SVG Icons**: Phone, Email, Location, Instagram, Facebook, WhatsApp
- **Professional Colors**:
  - Deep Black (#1A1A1A) - Primary
  - Professional Gray (#6B6B6B) - Secondary
  - Elegant Forest Green (#1B4D3E) - Accents
  - Luxury Navy (#1a3a52) - Button Color
  - Gold (#D4AF37) - Highlights

### ✅ Mobile Responsive

- **HeroSectionNew**: Responsive text sizes, optimized for mobile (text-4xl sm:text-5xl md:text-6xl)
- **LocationContact**: Mobile-first design, 300px map height on mobile, 500px on desktop
- **All Components**: Tailwind CSS breakpoints (sm, md, lg) for seamless adaptation

### ✅ User Experience

- Hover effects on buttons (scale-105 on hover, scale-95 on click)
- Icon buttons with proper spacing and alignment
- Smooth transitions and animations
- Accessible form inputs with focus states and placeholder text

---

## 🛠️ ADMIN FEATURES

### ✅ Business Settings Manager

- Salon Name, Phone, Email, Address
- Business Hours configuration
- Social Media links (Instagram, Facebook, WhatsApp, YouTube)
- Delete Account with password confirmation
- **Input Visibility Fixed**: All admin inputs now have proper styling with visibility

### ✅ Hero Manager Enhanced

- Upload background images (up to 5MB)
- Edit title, subtitle, CTA button text
- **Real-time Preview**: See changes as you make them
- Upload validation (file type, size checks)

### ✅ Content Manager

- Section-based content editing
- Hero content, Services, Portfolio, Footer text
- Real-time save functionality

### ✅ Services & Portfolio Managers

- Full CRUD operations
- Image uploads with Cloudinary
- Category management

---

## 📱 RESPONSIVE FEATURES

### Mobile Optimizations

✅ **HeroSection**:

- Phone: Single column layout
- Desktop: 2-column with image
- Responsive padding (px-4 sm:px-6)
- Responsive text sizes

✅ **LocationContact**:

- Mobile: Stacked layout
- Desktop: 2-column grid
- Map height: 300px mobile, 500px desktop
- Social icons properly spaced

✅ **Forms & Inputs**:

- Full-width on mobile
- Proper padding for touch targets
- Focus states for accessibility

---

## 🚀 DEPLOYMENT STEPS

### 1. Database Setup

```bash
# Create MongoDB Atlas cluster
# Get connection string: mongodb+srv://username:password@cluster.mongodb.net/dbname
# Add to server/.env as MONGODB_URI
```

### 2. Google Cloud Setup

- Create project in Google Cloud Console
- Enable Maps, OAuth, and other needed APIs
- Create OAuth 2.0 credentials
- Add redirect URIs (http://localhost:3001, production URL)

### 3. Cloudinary Setup

- Create Cloudinary account
- Get Cloud Name, API Key, API Secret
- Create upload preset for images

### 4. Server Deployment (e.g., Heroku, Railway, Render)

```bash
# Update environment variables in deployment platform
# Set NODE_ENV=production
# Deploy: git push to remote
```

### 5. Client Deployment (e.g., Vercel, Netlify)

```bash
# For client:
npm run build
# Deploy /dist folder

# For admin:
npm run build
# Deploy to separate environment or subdomain
```

### 6. First Admin Setup

1. Go to admin login
2. Create first admin account (signup)
3. Go to Settings tab
4. Fill in salon information:
   - Name
   - Phone
   - Email
   - Address
   - Business Hours
   - Social Media Links
5. Save All Settings
6. Go to Hero Manager
7. Upload background image
8. Edit hero content
9. Save

---

## 🔧 POST-DEPLOYMENT VERIFICATION

### ✅ Security Verification

- [ ] No hardcoded secrets in deployed code
- [ ] All environment variables loaded correctly
- [ ] Database connection working
- [ ] CORS properly configured for frontend domains

### ✅ Functionality Verification

- [ ] Login/Signup works
- [ ] Admin settings save to database
- [ ] Images upload to Cloudinary
- [ ] Google Maps displays with coordinates
- [ ] Social media links open correctly
- [ ] Email/WhatsApp/Call buttons functional

### ✅ Design Verification

- [ ] Client site displays correctly on mobile
- [ ] Admin panel displays correctly on mobile
- [ ] Icons render properly
- [ ] Colors match luxury theme
- [ ] All buttons responsive and clickable

---

## 📝 IMPORTANT NOTES

### Admin-Managed Information

- All salon details are now managed by admin through Settings tab
- No personal information in source code
- Each deployment can serve different salons (multi-tenant ready)

### Real-time Updates

- Save settings and see live preview in hero manager
- All changes sync with environment in real-time

### Photography

- Hero background image: Optional (only shows if uploaded)
- If no image: Fallback to elegant background color
- Support for high-quality images (up to 5MB)

### Icons

- All minimalist SVG icons with configurable colors
- Professional design fitting luxury aesthetic
- Consistent sizing (20px-28px depending on context)

---

## 🆘 TROUBLESHOOTING

### Blank Client Page

**Solution**: Check client .env.local variables, verify API_URL is correct

### Input Text Not Visible in Admin

**Solution**: Already fixed! AdminInput component has proper styling with focus states

### Images Not Uploading

**Solution**: Check Cloudinary credentials, verify upload preset matches

### Login Not Working

**Solution**: Check MongoDB connection, verify JWT_SECRET set, check CORS configuration

### Google Maps Not Showing

**Solution**: Verify API_KEY in environment, check coordinates in Settings

---

## 📞 SUPPORT RESOURCES

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Google Cloud Console: https://console.cloud.google.com
- Cloudinary: https://cloudinary.com/console
- Vercel Deploy: https://vercel.com/docs
- Heroku Deploy: https://devcenter.heroku.com

---

**Last Updated**: March 2026
**Version**: 1.0 - Production Ready
