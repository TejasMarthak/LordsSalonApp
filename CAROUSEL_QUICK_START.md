# 🎠 Hero Carousel - Quick Start

## What Changed?

✅ **Admin Panel** - Now manages multiple images (2-3+)
✅ **Database** - Stores array of images (`heroImages: [String]`)
✅ **Client** - Shows auto-rotating carousel (every 7 seconds)
✅ **Image Sizing** - Uses `object-cover` to fit card properly

---

## How to Use It

### 1️⃣ Admin: Upload Images
- Go to **Hero Section** in admin panel
- Fill Headline & Subheadline
- Upload 2-3+ images OR paste image URLs
- Click Save

### 2️⃣ Client: Watch Carousel
- Visit website
- Hero section shows first image
- Image changes automatically every 7 seconds
- Click dots or buttons to manually navigate

### 3️⃣ Customize Rotation Speed
Edit `client/src/components/sections/HeroSectionNew.jsx` line ~25:
```javascript
}, 7000); // Change to 5000 for 5 seconds, 10000 for 10 seconds
```

---

## Files Modified

| File | Changes |
|------|---------|
| `admin/src/components/modules/HeroManager.jsx` | Rewrote to handle multiple images with preview gallery |
| `client/src/components/sections/HeroSectionNew.jsx` | Added carousel with auto-rotation every 7 seconds |
| `server/models/PageContent.js` | Added `heroImages: [String]` to schema |
| `server/routes/content.js` | Updated GET & POST to handle image arrays |
| `server/server.js` | Increased JSON limit to 50MB |

---

## API Endpoints

### GET Hero Data
```bash
GET http://localhost:5000/api/content/hero
# Returns:
{
  "heroImages": ["image1.base64", "image2.base64", "image3.base64"],
  "headline": "Your Headline",
  "subheadline": "Your Subheadline",
  ...
}
```

### Save Hero Data (Admin Only)
```bash
POST http://localhost:5000/api/content/hero
Headers: Authorization: Bearer <token>
Body: {
  "heroImages": ["image1.base64", "image2.base64", "image3.base64"],
  "headline": "Your Headline",
  "subheadline": "Your Subheadline",
  ...
}
```

---

## Image Sizing (CSS)

Images are trimmed to fit card using:
```css
object-fit: cover;      /* Crops to fill container */
object-position: center; /* Centers the crop */
aspect-ratio: 4/5;      /* Portrait ratio */
```

No stretching or distortion! Perfect for salon/makeup photos.

---

## Testing Checklist

- [ ] Upload 2-3 images from admin
- [ ] Refresh admin page - images still there
- [ ] Go to client website
- [ ] Watch first image display
- [ ] Wait 7 seconds - image changes to #2
- [ ] Wait 7 seconds - image changes to #3
- [ ] Wait 7 seconds - image loops back to #1
- [ ] Click dot #2 - jumps to image 2
- [ ] Click Previous button - goes to image 1
- [ ] Click Next button - goes to image 2
- [ ] Images look properly cropped (no stretching)

---

## Troubleshooting

### Images not rotating?
- Check browser console for errors
- Verify Server is running: `npm run dev` in /server
- Verify at least 2 images are saved

### Images stretched/distorted?
- CSS `object-cover` should handle it
- Check if custom CSS is overriding it
- Make sure aspect ratio is set correctly

### Carousel not showing?
- Verify images were saved to database
- Check Network tab: GET /api/content/hero should return images
- Check browser console for fetch errors

### Can't save images?
- Verify Server running
- Check browser Network tab for 500 errors
- Verify admin token exists in localStorage
- Images should be under 5MB each

---

## Stats

📸 **Images per carousel:** 2-3+  
⏱️ **Rotation interval:** 7 seconds  
🎨 **Aspect ratio:** 4:5 (portrait)  
📱 **Responsive:** Yes (mobile to desktop)  
⌨️ **Navigation:** Auto-rotate, buttons, dots  
💾 **Storage:** MongoDB array (base64 or URLs)  

---

## Performance Tips

1. **Image size:** Keep images under 5MB
   - Compress before uploading
   - Use PNG or JPG format
   - Consider using image URLs instead of uploads

2. **Number of images:** 3-5 is ideal
   - More = slower transitions
   - Less = less variety

3. **Rotation speed:** 5-10 seconds recommended
   - Too fast (< 3 sec) = jarring
   - Too slow (> 15 sec) = boring

---

## Support

For issues:
1. Check the detailed guide in `HERO_CAROUSEL_COMPLETE.md`
2. Review error messages in browser console
3. Check server logs for backend errors
4. Verify all endpoints are responding

---

**Everything is ready! Start uploading carousel images now! 🚀**
