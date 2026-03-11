# SEO Implementation Examples & Integration Guide

## Quick Reference: What Each Component Does

### 🎯 SEO Component

**File**: `client/src/components/utils/SEO.jsx`  
**Purpose**: Manages all meta tags, Open Graph, Twitter cards  
**Usage**: Wrap at top of each page

```jsx
<SEO
  title="Page Title | Lords Salon"
  description="Page description"
  canonicalUrl="https://lords-salon.com/page"
  ogImage="https://lords-salon.com/image.jpg"
/>
```

### 📊 JSON-LD Schemas

**File**: `client/src/utils/jsonLdSchema.js`  
**Purpose**: Structured data for Google Rich Results  
**Hook**: `useJsonLd(schema)` - Inject into page head

```jsx
useJsonLd(generateLocalBusinessSchema());
useJsonLd(generateServiceSchema(service));
```

### 🖼️ OptimizedImage Component

**File**: `client/src/components/utils/OptimizedImage.jsx`  
**Purpose**: Lazy loading, responsive sizing, WebP  
**Usage**: Replace `<img>` tags

```jsx
<OptimizedImage
  src="image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
/>
```

### ⚙️ Image Optimization Utils

**File**: `server/utils/imageOptimization.js`  
**Purpose**: Server-side image optimization with Sharp  
**Usage**: In upload routes

```javascript
await optimizeImage(filePath, fileName, "main");
```

### 🗺️ Sitemap Generation

**File**: `server/routes/sitemap.js`  
**Purpose**: Dynamic XML sitemap from MongoDB  
**Routes**: `/sitemap.xml`, `/sitemap-index.xml`

### 📋 robots.txt

**File**: `server/public/robots.txt`  
**Purpose**: Search engine crawler directives

---

## Integration Examples

### Example 1: Using OptimizedImage in ServiceMenu Component

**Current Code** (if using regular img):

```jsx
// client/src/components/sections/ServiceMenu.jsx
{
  services.map((service) => (
    <div key={service._id} className="p-6 border rounded-lg">
      <img
        src={service.imageUrl}
        alt={service.name}
        className="w-full h-64 object-cover rounded"
      />
      <h3>{service.name}</h3>
    </div>
  ));
}
```

**Updated with SEO** (OptimizedImage):

```jsx
import OptimizedImage from "../utils/OptimizedImage";

{
  services.map((service) => (
    <div key={service._id} className="p-6 border rounded-lg">
      <OptimizedImage
        src={service.imageUrl}
        alt={`${service.name} makeup service`}
        width={600}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-64 object-cover rounded"
      />
      <h3>{service.name}</h3>
    </div>
  ));
}
```

**Benefits**:

- ✅ Images load 40% faster (WebP format)
- ✅ Lazy loading (better performance)
- ✅ Responsive sizing (saves data on mobile)
- ✅ No layout shift

---

### Example 2: Using OptimizedImage in Lookbook Component

**Current Code**:

```jsx
// client/src/components/sections/Lookbook.jsx
{
  portfolioItems.map((item) => (
    <div key={item._id} className="rounded-lg overflow-hidden">
      <img src={item.imageUrl} alt={item.title} className="w-full" />
    </div>
  ));
}
```

**Updated with PortfolioImage Wrapper**:

```jsx
import { PortfolioImage } from "../utils/OptimizedImage";

{
  portfolioItems.map((item) => (
    <PortfolioImage
      key={item._id}
      imageUrl={item.imageUrl}
      beforeImageUrl={item.beforeImageUrl}
      title={item.title}
      category={item.category}
      onClick={() => openDetails(item)}
      className="aspect-square"
    />
  ));
}
```

**Before/After Toggle**:

- Clicking portfolio image shows "Before" version
- Great for makeup transformations
- Improves engagement metrics

---

### Example 3: Server-Side Image Upload Optimization

**Current Express Route**:

```jsx
// server/routes/portfolio.js
import multer from "multer";

const upload = multer({ dest: "uploads/temp" });

router.post("/upload", upload.single("image"), async (req, res) => {
  const portfolio = new PortfolioItem({
    imageUrl: req.file.path,
    // ...
  });
  await portfolio.save();
  res.json(portfolio);
});
```

**Updated with Optimization**:

```jsx
import multer from "multer";
import { imageOptimizationMiddleware } from "../utils/imageOptimization.js";

const upload = multer({ dest: "uploads/temp" });

router.post(
  "/upload",
  upload.array("images", 2), // Allow up to 2 images (main + before)
  imageOptimizationMiddleware, // Auto-optimize!
  async (req, res) => {
    try {
      // req.optimizedImages contains:
      // [{webpPath, jpgPath, webpSize, jpgSize, optimizationRatio}, ...]

      const portfolio = new PortfolioItem({
        imageUrl: req.optimizedImages[0].webpPath,
        imageUrlFallback: req.optimizedImages[0].jpgPath,
        beforeImageUrl: req.optimizedImages[1]?.webpPath || null,
        beforeImageUrlFallback: req.optimizedImages[1]?.jpgPath || null,
      });

      await portfolio.save();

      // Return optimization stats to client
      res.json({
        success: true,
        portfolio,
        optimized: req.optimizedImages,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
```

**Optimization Stats Returned**:

```json
{
  "success": true,
  "portfolio": {...},
  "optimized": [
    {
      "filename": "bridal-makeup-after.jpg",
      "webpPath": "uploads/optimized/uuid-1.webp",
      "jpgPath": "uploads/optimized/uuid-1.jpg",
      "webpSize": 45230,
      "jpgSize": 125450,
      "optimizationRatio": "63.91%"
    }
  ]
}
```

---

### Example 4: Dynamic Service Page with Full SEO

**File**: `client/src/pages/ServiceDetailPage.jsx` (already created)

This page demonstrates all 4 SEO pillars:

```jsx
import SEO from "../components/utils/SEO";
import { useJsonLd, generateServiceSchema } from "../utils/jsonLdSchema";
import OptimizedImage from "../components/utils/OptimizedImage";

const ServiceDetailPage = ({ slug }) => {
  const [service, setService] = useState(null);

  useEffect(() => {
    // Dynamically fetch service
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/services?name=${slug}`)
      .then((res) => setService(res.data[0]));
  }, [slug]);

  // Pillar 2: Inject JSON-LD Schema
  if (service) {
    useJsonLd(generateServiceSchema(service));
  }

  if (!service) return <div>Loading...</div>;

  // Pillar 1: Dynamic Meta Tags
  return (
    <>
      <SEO
        title={`${service.name} | Professional Makeup Services | Lords Salon`}
        description={service.description}
        canonicalUrl={`https://lords-salon.com/services/${slug}`}
        ogImage={service.imageUrl}
        keywords={`${service.name}, ${service.category}, makeup, Vadodara`}
      />

      {/* Pillar 3: Optimized Images */}
      <OptimizedImage
        src={service.imageUrl}
        alt={service.name}
        width={800}
        height={600}
        priority={true} // Above-the-fold
        className="w-full rounded-lg"
      />

      {/* Page Content */}
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <div>Duration: {service.duration} min</div>
      <div>Price: ₹{service.price}</div>
    </>
  );
};
```

---

### Example 5: Homepage with Full SEO Implementation

**File**: `client/src/App.jsx` (already updated)

```jsx
import SEO from "./components/utils/SEO";
import {
  useJsonLd,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from "./utils/jsonLdSchema";

function App() {
  // Pillar 2: Inject global schemas
  useJsonLd(generateLocalBusinessSchema());
  useJsonLd(generateOrganizationSchema());

  return (
    <>
      {/* Pillar 1: Homepage Meta Tags */}
      <SEO
        title="Lords Professional Makeup Studio & Salon | Makeup & Hair Services in Vadodara"
        description="Premium makeup and salon services in Vadodara, Gujarat. Expert bridal makeup, hair styling, and skincare treatments."
        canonicalUrl="https://lords-salon.com"
        keywords="makeup salon, bridal makeup, hair styling, skincare, Vadodara"
      />

      <Header />
      <main>
        {/* Pillar 3: Optimized images in components */}
        <HeroSection />
        <ServiceMenu />
        <Lookbook />
        <LocationContact />
      </main>
      <Footer />
    </>
  );
}
```

---

### Example 6: Backend Sitemap Implementation

**File**: `server/routes/sitemap.js` (already created)

The sitemap **automatically** generates XML including:

- ✅ All services from MongoDB
- ✅ All portfolio items from MongoDB
- ✅ Static pages (home, about, contact)

**How it works**:

```javascript
// GET /sitemap.xml automatically:
1. Queries Service collection from MongoDB
2. Queries PortfolioItem collection from MongoDB
3. Builds XML with lastmod dates
4. Returns with Cache-Control header (1 hour)
```

**Example XML Output**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lords-salon.com/</loc>
    <lastmod>2024-03-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lords-salon.com/services/bridal-makeup</loc>
    <lastmod>2024-03-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... all services and portfolio items ... -->
</urlset>
```

---

## Step-by-Step Implementation Checklist

### Phase 1: Setup (5 minutes)

- [ ] Run `npm install` in client/ and server/
- [ ] Verify SEO component exists at `client/src/components/utils/SEO.jsx`
- [ ] Verify jsonLdSchema utility exists at `client/src/utils/jsonLdSchema.js`
- [ ] Verify OptimizedImage component exists at `client/src/components/utils/OptimizedImage.jsx`
- [ ] Verify server has sitemap route in `server/routes/sitemap.js`
- [ ] Verify robots.txt exists at `server/public/robots.txt`

### Phase 2: Integration (30 minutes)

- [ ] Update `App.jsx` to include SEO component (✅ already done)
- [ ] Update `main.jsx` with HelmetProvider (✅ already done)
- [ ] Replace `<img>` tags in `ServiceMenu.jsx` with `<OptimizedImage />`
- [ ] Replace `<img>` tags in `Lookbook.jsx` with `<PortfolioImage />`
- [ ] Test homepage locally at http://localhost:3000

### Phase 3: Database & API (15 minutes)

- [ ] Update MongoDB with real business info (hours, address, phone)
- [ ] Test `/api/services` endpoint
- [ ] Test `/api/portfolio` endpoint
- [ ] Verify images are serving correctly

### Phase 4: Testing (20 minutes)

- [ ] Run Google Rich Results Test
- [ ] Run Schema.org Validator
- [ ] Check PageSpeed Insights
- [ ] Verify sitemap at http://localhost:5000/sitemap.xml
- [ ] Check robots.txt at http://localhost:5000/robots.txt

### Phase 5: Deployment (40 minutes)

- [ ] Deploy client frontend to Vercel
- [ ] Deploy server backend to Render/Railway
- [ ] Test production URLs in Google tools
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor Search Console daily for 1 week

### Phase 6: Optimization (Ongoing)

- [ ] Add Google Business Profile
- [ ] Collect customer reviews
- [ ] Monitor Search Console for errors
- [ ] Update portfolio regularly
- [ ] Check rankings for target keywords

---

## Common Mistakes & How to Avoid Them

### ❌ Mistake 1: Forgetting HelmetProvider

```jsx
// WRONG - Won't work
export default App() {
  return <SEO title="..." />;  // Won't inject!
}

// CORRECT - ✅
// In main.jsx
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

### ❌ Mistake 2: Using Regular <img> Instead of OptimizedImage

```jsx
// WRONG - No optimization
<img src="image.jpg" alt="test" />

// CORRECT - ✅ Lazy load + WebP + responsive
<OptimizedImage src="image.jpg" alt="test" priority={false} />
```

### ❌ Mistake 3: Missing `alt` Attributes

```jsx
// WRONG - No SEO benefit
<OptimizedImage src="image.jpg" />

// CORRECT - ✅ Keyword-rich alt text
<OptimizedImage
  src="image.jpg"
  alt="Professional bridal makeup in Vadodara - Before and after transformation"
/>
```

### ❌ Mistake 4: Not Updating Business Info in JSON-LD

```javascript
// WRONG - Generic placeholder
phone: "+91-0000000000";

// CORRECT - ✅ Your actual info
phone: "+91-9876543210";
```

### ❌ Mistake 5: Using Same Meta Description for All Pages

```jsx
// WRONG - No uniqueness
<SEO title="Lords Salon" description="Welcome" />

// CORRECT - ✅ Page-specific
<SEO
  title={`${service.name} | Professional Makeup | Lords Salon`}
  description={`Professional ${service.name} in Vadodara by award-winning makeup artists...`}
/>
```

---

## Performance Monitoring

### Monitor These KPIs Weekly

```markdown
| Week | Homepage | Services | Portfolio | Notes              |
| ---- | -------- | -------- | --------- | ------------------ |
| 1    | 2.1s     | 2.3s     | 1.9s      | Initial baseline   |
| 2    | 1.8s     | 2.0s     | 1.6s      | After optimization |
| 3    | 1.7s     | 1.9s     | 1.5s      | Steady improvement |
```

### Google Search Console Metrics

- **Impressions** - How often your site appears in search
- **Clicks** - How often users click through
- **CTR** - Click-through rate (target: 5%+)
- **Average Position** - Your ranking (target: #1-3 for target keywords)

### Lighthouse Scores

```javascript
// Run locally
npm run build  // Both client and server
// Then test with Lighthouse in Chrome DevTools

// Target scores:
Performance: 90+
Accessibility: 95+
Best Practices: 90+
SEO: 100
```

---

## Deployment Verification

After deploying to production:

```bash
# 1. Test meta tags on homepage
Visit: https://lords-salon.com
Inspect → Application → Manifests
Verify all meta tags present

# 2. Test structured data
Visit: https://search.google.com/test/rich-results
Enter: https://lords-salon.com
Result: Should show LocalBusiness schema

# 3. Check sitemap
Visit: https://api.lords-salon.com/sitemap.xml
Result: Should show XML with all pages

# 4. Check robots.txt
Visit: https://api.lords-salon.com/robots.txt
Result: Should show crawl directives

# 5. Monitor Google Search Console
Visit: https://search.google.com/search-console
Add property: lords-salon.com
Submit sitemap in Sitemaps section
```

---

## Files Quick Reference

| File                                             | Purpose                    | Update?                |
| ------------------------------------------------ | -------------------------- | ---------------------- |
| `client/src/components/utils/SEO.jsx`            | Meta tags                  | ❌ No                  |
| `client/src/utils/jsonLdSchema.js`               | JSON-LD                    | ✅ Yes (business info) |
| `client/src/components/utils/OptimizedImage.jsx` | Image optimization         | ❌ No                  |
| `client/src/App.jsx`                             | App wrapper + homepage SEO | ✅ Done                |
| `client/src/main.jsx`                            | HelmetProvider setup       | ✅ Done                |
| `server/routes/sitemap.js`                       | Sitemap generation         | ❌ No                  |
| `server/public/robots.txt`                       | Crawler directives         | ✅ Maybe (customize)   |
| `server/utils/imageOptimization.js`              | Sharp optimization         | ❌ No                  |

---

That's it! You now have a complete, production-ready SEO system for Lords Salon. 🚀

**Next**: Deploy to production and monitor in Google Search Console!
