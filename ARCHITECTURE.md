# 🏛️ Lords Salon Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND TIER                               │
├─────────────────────────────────────────────────────────────────┤
│  Client (React/Vite)        │        Admin (React/Vite)         │
│  http://localhost:3000      │        http://localhost:3001      │
│  - Hero Section             │        - Login Page               │
│  - Services Menu            │        - Dashboard                │
│  - Lookbook/Portfolio       │        - Services Manager         │
│  - Location + Maps          │        - Portfolio Manager        │
│  - Staff Showcase           │        - Staff Manager            │
└──────────────────────┬───────────────────────┬──────────────────┘
                       │                       │
              ┌────────▼───────────────────────▼────────┐
              │   HTTP(S) / REST API Requests           │
              │   - Services                            │
              │   - Portfolio                           │
              │   - Staff                               │
              │   - Authentication                      │
              └────────┬───────────────────────┬────────┘
                       │                       │
┌──────────────────────▼───────────────────────▼────────────────────┐
│                    APPLICATION TIER                               │
├────────────────────────────────────────────────────────────────────┤
│               Node.js Express API Server                           │
│               http://localhost:5000                                │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ ROUTES                                                         │ │
│  │ ├─ POST   /api/auth/login (admin authentication)              │ │
│  │ ├─ GET    /api/auth/me (current admin info)                  │ │
│  │ ├─ GET    /api/services (fetch all services)                 │ │
│  │ ├─ POST   /api/services (create service - admin)             │ │
│  │ ├─ PUT    /api/services/:id (update service - admin)         │ │
│  │ ├─ DELETE /api/services/:id (delete service - admin)         │ │
│  │ ├─ GET    /api/portfolio (fetch portfolio items)             │ │
│  │ ├─ POST   /api/portfolio (create portfolio - admin)          │ │
│  │ ├─ PUT    /api/portfolio/:id (update portfolio - admin)      │ │
│  │ ├─ DELETE /api/portfolio/:id (delete portfolio - admin)      │ │
│  │ ├─ GET    /api/staff (fetch staff members)                   │ │
│  │ ├─ POST   /api/staff (create staff - admin)                  │ │
│  │ ├─ PUT    /api/staff/:id (update staff - admin)              │ │
│  │ ├─ DELETE /api/staff/:id (delete staff - admin)              │ │
│  │ ├─ GET    /sitemap.xml (dynamic XML sitemap)                 │ │
│  │ ├─ GET    /sitemap-index.xml (sitemap index)                 │ │
│  │ ├─ GET    /robots.txt (search engine directives)             │ │
│  │ └─ GET    /api/health (health check endpoint)                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ MIDDLEWARE                                                     │ │
│  │ ├─ CORS Handler (whitelist specific origins)                 │ │
│  │ ├─ JWT Authentication (admin-only endpoints)                 │ │
│  │ ├─ Request Validation                                         │ │
│  │ ├─ Image Optimization (Sharp - convert to WebP/JPEG)         │ │
│  │ └─ Error Handling                                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                       │
            ┌──────────▼──────────┐
            │  CORS Whitelist     │
            ├─────────────────────┤
            │ - http://localhost:3000
            │ - http://localhost:3001
            │ - https://prod-client.app
            │ - https://prod-admin.app
            └─────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────────┐
│                      DATABASE TIER                                │
├────────────────────────────────────────────────────────────────────┤
│ MongoDB Atlas (Cloud)                                              │
│ CONNECTION: mongodb+srv://user:pass@cluster.mongodb.net/lords-salon
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Collections                                                    │ │
│  │ ├─ services                                                   │ │
│  │ │  ├─ name (String, indexed)                                 │ │
│  │ │  ├─ category (Enum)                                        │ │
│  │ │  ├─ price (Number)                                         │ │
│  │ │  ├─ duration (Number)                                      │ │
│  │ │  └─ description (String)                                   │ │
│  │ ├─ portfolioitems                                            │ │
│  │ │  ├─ title (String)                                         │ │
│  │ │  ├─ category (Enum, indexed)                               │ │
│  │ │  ├─ imageUrl (String)                                      │ │
│  │ │  ├─ beforeImageUrl (String, optional)                      │ │
│  │ │  └─ stylistId (ObjectId ref)                               │ │
│  │ ├─ staffmembers                                              │ │
│  │ │  ├─ name (String, indexed)                                 │ │
│  │ │  ├─ role (Enum)                                            │ │
│  │ │  ├─ bio (String)                                           │ │
│  │ │  ├─ specializations (Array)                                │ │
│  │ │  └─ experience (Number)                                    │ │
│  │ └─ admins                                                    │ │
│  │    ├─ email (String, unique, indexed)                        │ │
│  │    ├─ password (String, hashed)                              │ │
│  │    ├─ name (String)                                          │ │
│  │    └─ role (Enum: owner, manager)                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## Request Flow Example

### Client Fetches Services

```
Client Browser          Express API         MongoDB
    │                       │                  │
    │──GET /api/services───▶│                  │
    │                       │──Query services─▶│
    │                       │◀──Return docs───│
    │◀──JSON response───────│                  │
    │                       │                  │
```

### Admin Creates Service

```
Admin Browser           Express API         MongoDB
    │                       │                  │
    │──POST /api/services──▶│                  │
    │  (with JWT token)     │                  │
    │                       │──Verify token    │
    │                       │──Validate data   │
    │                       │──Insert doc────▶│
    │                       │◀──Confirmation──│
    │◀──201 + Resource──────│                  │
    │                       │                  │
```

## Component Hierarchy

### Client App

```
App
├── HelmetProvider (SEO - Meta Tags)
├── SEO Component (Dynamic meta tags per page)
├── Header
│   ├── Logo/Brand
│   ├── Navigation Menu
│   └── Mobile Menu Toggle
├── HeroSection
│   ├── Background Video/Image
│   ├── Overlay
│   ├── Brand Text
│   └── CTA Button
├── ServiceMenu
│   ├── Category Filters
│   └── Services Grid
│       └── ServiceCard with OptimizedImage
├── Lookbook
│   ├── Category Filters
│   ├── Masonry Grid
│   │   └── PortfolioItem with OptimizedImage
│   └── Modal (for full view)
├── LocationContact
│   ├── Google Map
│   ├── Business Hours
│   └── Contact Info
├── Footer
│   ├── Links
│   ├── Contact
│   └── Social Media
├── ServiceDetailPage (Dynamic - with SEO + JSON-LD)
│   ├── Service Info
│   └── OptimizedImage
└── PortfolioDetailPage (Dynamic - with SEO + JSON-LD)
    ├── Before/After Images
    └── OptimizedImage
```

**SEO Utilities Used**

- `SEO.jsx` - Manages dynamic title, description, canonical URL, OG tags
- `OptimizedImage.jsx` - Renders images with responsive srcSet, WebP+JPEG fallback, lazy loading
- `jsonLdSchema.js` - Generates BeautySalon, Organization, Service, LocalBusiness schemas

### Admin App

```
App
├── LoginPage (if not authenticated)
├── AdminHeader
│   ├── Logo
│   ├── Admin Info
│   └── Logout Button
├── Sidebar
│   └── Navigation Links
└── Main Content Area
    ├── Dashboard Page
    │   ├── Stats Cards
    │   └── Quick Links
    ├── ServicesManager
    │   ├── Form (Add/Edit)
    │   └── Services Table
    ├── PortfolioManager
    │   ├── Form (Add/Edit)
    │   └── Portfolio Grid
    ├── StaffManager
    │   ├── Form (Add/Edit)
    │   └── Staff List
    └── BookingsPage
        └── Calendar/List View
```

## Data Flow Patterns

### Create Flow

```
User Input → Component State → Validation → API Call → Database → UI Update
```

### Read Flow

```
Component Mount → useEffect → API Call → Database Query → Component State → Render
```

### Update Flow

```
Edit Button → Form Population → User Changes → Submit → API Call → Database Update → List Refresh
```

### Delete Flow

```
Delete Button → Confirmation → API Call → Database Delete → List Refresh
```

## Authentication Flow

```
1. Admin visits /login
2. Enters credentials
3. Client sends: POST /api/auth/login { email, password }
4. Server:
   a. Find admin by email
   b. Compare password hash
   c. Generate JWT token
   d. Return token + admin info
5. Client: Store token in localStorage
6. Client: Set Authorization header for future requests
7. Admin redirected to dashboard
8. Protected routes use middleware to verify token
```

## State Management

### Client App

- Global: Services, Portfolio (fetched from API)
- Local: Filters, UI state (menu open, modal visibility)

### Admin App

- Global: Admin authentication, Current admin info
- Local: Form data, Edit mode, Loading states

## Scalability Considerations

### Current Architecture

- Monolithic backend (can be scaled horizontally)
- Stateless API (each request independent)
- Database connection pooling

### Future Improvements

- Implement caching (Redis)
- Add webhooks for real-time updates
- Microservices architecture (separate services)
- Message queue (for async operations)
- CDN for static assets (images)

## Deployment Architecture

```
Remote GitHub Repo
    │
    ├─ Vercel (Client)
    ├─ Vercel (Admin)
    └─ Render/Railway (Server)
         │
         └─ MongoDB Atlas (Database)
```

## Security Layers

```
1. CORS Whitelist (only known origins)
2. JWT Authentication (admin routes)
3. Password Hashing (bcryptjs)
4. Input Validation (server-side)
5. Environment Variables (no hardcoded secrets)
6. HTTPS (production only)
7. HTTP-Only Cookies (future enhancement)
```

## Performance Optimization

- **Frontend**: Code splitting with Vite
- **Backend**: Indexing on frequently queried fields
- **Database**: Connection pooling
- **API**: Pagination for large datasets (future)
- **Caching**: Browser cache + server-side (future)

## Error Handling

```
Client Error → Try/Catch → Show User Message
Server Error → Express Error Handler → Log to Console → Return 500
Database Error → Validation → Return Error Response
```

## Monitoring & Logging

Future enhancements:

- Server logs (file or cloud service)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics (Mixpanel/Amplitude)

## 🔍 SEO Architecture

The platform includes an enterprise-grade SEO system with the following architecture:

### Frontend SEO Components

**SEO Manager (`SEO.jsx`)**

- Uses react-helmet-async for safe dynamic meta tag injection
- Manages title, meta description, canonical URL, og:tags, twitter:tags
- Automatically injects metadata on each page

**Optimized Images (`OptimizedImage.jsx`)**

- Converts images to WebP with JPEG fallback
- Generates responsive srcSet for 480px, 768px, 1200px, 1920px viewports
- Implements lazy loading for performance
- Maintains aspect ratio to prevent layout shifts

**JSON-LD Schema Generator**

- `BeautySalon` schema for homepage
- `LocalBusiness` schema with hours and location
- `Service` schema for each service page
- `Organization` schema for company info
- Validates schema markup for Google compliance

### Backend SEO Features

**Dynamic Sitemap Generation**

- Route: `GET /sitemap.xml` - Returns XML sitemap
- Route: `GET /sitemap-index.xml` - Returns sitemap index for scalability
- Queries MongoDB collections for services and portfolio items
- Automatically includes priority and changefreq attributes
- Supports both hierarchical (index + individual maps) and flat sitemap structures

**Image Optimization Service**

- Converts uploads to WebP format automatically
- Creates JPEG fallback for older browsers
- Generates thumbnail sizes for responsive use
- Compatible with OptimizedImage component
- Middleware-ready for easy integration

**Search Engine Directives**

- `robots.txt` configured at `/robots.txt`
- Blocks admin and API routes from indexing
- Allows static assets
- Links to sitemaps for discovery
- Directives for all major search engines

### SEO Data Flow

```
Admin Creates Service/Portfolio
    │
    ▼
MongoDB Document Stored
    │
    ├─▶ Sitemap Generation (next page load)
    │   │
    │   └─▶ /sitemap.xml updated
    │
    ├─▶ User Visits Service Page
    │   │
    │   ├─▶ SEO Component Injects Meta Tags
    │   │   ├─ Dynamic Title + Description
    │   │   ├─ Canonical URL
    │   │   └─ og:image (OptimizedImage)
    │   │
    │   ├─▶ JSON-LD Schema Injected
    │   │   └─ Google Search Console validates
    │   │
    │   └─▶ Images Delivered Optimized
    │       ├─ WebP format preferred
    │       ├─ JPEG fallback
    │       └─ Responsive srcSet
    │
    └─▶ Search Engines Crawl
        ├─ robots.txt → allowed paths
        ├─ sitemap.xml → all indexable pages
        ├─ Meta tags → page content
        ├─ JSON-LD → structured data
        └─ Images → WebP format → faster crawl
```

---

**Diagram Legend**:

- ▶ Request/Flow direction
- ◀ Response direction
- | Connection
- ─ Communication
