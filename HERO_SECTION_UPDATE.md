# Hero Section - Scroll Animation Update

## Overview
The Hero Section has been updated with an advanced scroll-driven animation system that creates a smooth, premium experience as users scroll through your salon's images.

## Key Features

### 1. **Layout Structure**
- **Left Side**: Heading text, subheadline, description, and CTA buttons
- **Right Side**: Image carousel with multiple beauty service images
- **Image Containers**: Fixed 300×400px boxes with 3:4 aspect ratio

### 2. **Scroll Animation Phases**

#### Phase 1: Text Exit (0-25% scroll)
- Left-side text gradually fades out and slides upward
- Images expand smoothly from 50% width to fill the entire screen
- Smooth transition with no abrupt changes
- Border radius gradually decreases as image expands

#### Phase 2: Full-Screen Image Carousel (25%-100% scroll)
- Image container becomes full-screen
- Each image appears one at a time based on scroll position
- Example: 4 images = 4 scroll steps (one image per viewport height)
- User has full control over image progression via scroll

### 3. **Image Features**
- **Fixed Size**: 300×400px with 3:4 aspect ratio in initial state
- **Multiple Images**: Supports unlimited hero images
- **Smooth Transitions**: Images transition smoothly as user scrolls
- **Overlay Effect**: Subtle gradient overlay on the active image for contrast
- **Responsive**: Adapts gracefully to screen sizes (simplified animation on mobile < 768px)

### 4. **Text Animation**
- **Accent Bar**: Gold accent line appears/disappears based on scroll
- **Headline Fade**: Main heading fades out as user scrolls
- **Subheadline Opacity**: Secondary text opacity controlled by scroll
- **Button Interaction**: CTA buttons fade and become non-interactive during scroll

### 5. **Scroll Indicator**
- Shows "Scroll to Explore" text with arrow icon
- Automatically hides as user begins scrolling
- Styled to match the current background image

## Technical Implementation

### GSAP Scroll Animation
- Uses **GSAP ScrollTrigger** for smooth scroll-based animations
- Pin effect keeps the hero section fixed during scroll
- Scrub value set to 1 for smooth animation tied to scroll speed

### Responsive Behavior
- **Desktop (≥768px)**: Full animation with all features
- **Mobile (<768px)**: Simplified animation (text-only, no full-screen expansion)

### Image Brightness Detection
- Automatically detects image brightness using canvas analysis
- Adjusts text color (white/dark) for optimal contrast
- Updates accent colors dynamically
- Ensures text remains readable over any image

## Usage

### Default Images
If no hero images are fetched from the API, the component uses 4 default beauty images from Unsplash.

### Custom Images
Upload hero images through the Admin Panel at `/admin` > Hero Manager. The component will automatically:
- Fetch the images from `GET /api/content/hero`
- Display them in the carousel
- Adjust text colors based on image brightness

### Number of Images
- Minimum: 1 image
- Recommended: 3-5 images (optimal scroll experience)
- Maximum: Unlimited

## Scroll Experience Example (4 Images)

1. **Initial View** (0% scroll)
   - Text fully visible on left
   - One image visible on right (50% width)
   - Scroll indicator shows

2. **First Scroll** (0-25%)
   - Image 1 remains visible
   - Text fades and slides up
   - Image expands to 100% width

3. **Second Scroll** (25-50%)
   - Image 2 appears as user scrolls
   - Text completely hidden
   - Full-screen image visible

4. **Third Scroll** (50-75%)
   - Image 3 appears

5. **Fourth Scroll** (75-100%)
   - Image 4 appears (final image)

## CSS Classes Used
- `font-playfair`: Elegant heading font
- `font-inter`: Modern body text font
- `rounded-lg`: Subtle border radius on images
- `shadow-2xl`: Deep shadow for image depth
- `animate-bounce`: Bouncing scroll indicator

## Performance Optimizations
- GPU acceleration with `willChange` properties
- Images loaded on-demand (only load current image brightness detection)
- Efficient scroll trigger management
- Cleanup of event listeners on unmount

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE: Not supported (modern browsers only)

## Future Enhancements
- Add image parallax effect
- Implement image zoom on full-screen
- Add image pagination indicators
- Add keyboard navigation
- Add touch gesture support for mobile

## Troubleshooting

### Animation Not Working
- Ensure GSAP is installed: `npm list gsap`
- Check browser console for errors
- Verify ScrollTrigger plugin is registered

### Text Not Visible Over Images
- Check image brightness detection in console
- Ensure images load properly
- Text color adjusts automatically based on image

### Scroll Indicator Visible Too Long
- Normal behavior - it fades as you scroll
- Disappears completely after 40% scroll progress

## Support
For issues or feature requests, refer to the main documentation or contact the development team.
