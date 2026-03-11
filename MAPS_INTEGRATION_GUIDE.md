# 🗺️ Google Maps Component Implementation Guide

## Overview

The `LocationContact.jsx` component provides a minimal, luxury-themed Google Maps integration for the Lords salon platform. It features:

- Customized grayscale styling
- Custom SVG location marker
- Interactive info window
- Business hours display
- Responsive design
- One-click phone integration

## Setup

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Maps JavaScript API"
4. Go to "Credentials" → "Create API Key"
5. Restrict to HTTP referrers (your domain)
6. Copy the key

### 2. Add to Environment Variables

Add to your `.env.example` and deployed `.env`:

```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Add Script to HTML

In `client/index.html`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=%VITE_GOOGLE_MAPS_API_KEY%&libraries=marker"></script>
```

## 🔍 SEO Integration with Maps

The location and business information displayed in the Maps component is automatically integrated with SEO:

**JSON-LD LocalBusiness Schema**

- Location coordinates (latitude/longitude) are injected into LocalBusiness schema
- Business address, phone, and hours appear in structured data
- Search engines use this for local search results and knowledge panels

**LocalBusiness Schema Elements** (from this component):

```json
{
  "@type": "LocalBusiness",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.3072,
    "longitude": 73.1812
  },
  "address": "Vadodara, Gujarat, India",
  "telephone": "+91-XXXXXXXXXX"
}
```

**Best Practices**

- Keep coordinates accurate for better local SEO ranking
- Ensure location data matches across all pages (Maps, schema, footer)
- Update business hours in the component and environment variables
- For accuracy, verify coordinates on [Google Maps Platform](https://maps.google.com)

For complete SEO documentation, see [SEO_OPTIMIZATION_GUIDE.md](SEO_OPTIMIZATION_GUIDE.md).

##Component Structure

```jsx
LocationContact Export Component
├── MAP Container (ref-based)
├── Business Hours State
├── Salon Info (from env variables)
├── useEffect (initialization)
├── initMap function
│   ├── Create map instance
│   ├── Apply custom styles
│   ├── Create custom marker
│   ├── Add info window
│   └── Handle interactions
└── Render
    ├── Google Map
    └── Contact Information Section
```

## Customization

### Change Map Styling

Edit the `styles` array in `initMap()`:

```javascript
styles: [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }], // Background color
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#e0e0e0" }], // Water color
  },
  // ... more styles
];
```

**Available features**: all, road, transit, poi, etc.

### Customize Marker

Replace the custom marker icon:

```javascript
icon: {
  path: 'M12 2C6.48 2 2 6.48 2 12...',  // SVG path
  fillColor: '#000000',                  // Color
  strokeColor: '#fff',                   // Stroke
  scale: 1.5,                           // Size
}
```

Find more SVG paths at [Google Maps Icons](https://fonts.google.com/icons)

### Change Business Hours

Update the `businessHours` state:

```javascript
const [businessHours] = useState([
  { day: "Monday - Friday", hours: "10:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "11:00 AM - 9:00 PM" },
  { day: "Sunday", hours: "12:00 PM - 7:00 PM" },
]);
```

### Update Salon Location

Edit environment variables:

```
VITE_SALON_LAT=22.3072
VITE_SALON_LNG=73.1812
VITE_SALON_ADDRESS=Vadodara, Gujarat, India
VITE_SALON_PHONE=+91-XXXXXXXXXX
VITE_SALON_EMAIL=info@lords-salon.com
```

## Styling Reference

### Map Controls

- `zoomControl: true` - Zoom buttons
- `mapTypeControl: false` - Map/Satellite toggle
- `streetViewControl: false` - Street View
- `fullscreenControl: true` - Fullscreen button

### Info Window Content

Customize the popup that appears on marker click:

```javascript
const infoWindow = new window.google.maps.InfoWindow({
  content: `
    <div style="...">
      <h3>${salonInfo.name}</h3>
      <p>${salonInfo.address}</p>
      <p>📞 ${salonInfo.phone}</p>
    </div>
  `,
  maxWidth: 300,
});
```

## Advanced Features

### Add Multiple Markers

```javascript
const locations = [
  { lat: 22.3072, lng: 73.1812 },
  { lat: 22.31, lng: 73.185 },
];

locations.forEach((loc) => {
  new window.google.maps.Marker({
    position: loc,
    map: mapInstance,
  });
});
```

### Add Drawing Tools

```javascript
// Include in script tag
<script src="https://maps.googleapis.com/maps/api/js?key=KEY&libraries=drawing"></script>;

const drawingManager = new google.maps.drawing.DrawingManager({
  drawingMode: google.maps.drawing.OverlayType.MARKER,
  drawingControl: true,
  drawingControlOptions: {
    position: google.maps.ControlPosition.TOP_CENTER,
  },
});
drawingManager.setMap(map);
```

### Add Search Box

```javascript
const input = document.getElementById("pac-input");
const searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

searchBox.addListener("places_changed", () => {
  const places = searchBox.getPlaces();
  // Handle place selection
});
```

## Troubleshooting

### Map not showing

- Verify API key is valid
- Check CORS restrictions
- Ensure script tag is in HTML
- Check console for errors

### Custom marker not showing

- SVG path must be valid
- Check fillColor is not transparent
- Verify anchor point is correct

### Info window cut off

- Increase `maxWidth`
- Adjust `content` styling
- Check container height

## Performance Optimization

```javascript
// Only load map when component mounts
useEffect(() => {
  if (!window.google) {
    console.error("Google Maps API not loaded");
    return;
  }
  initMap();
}, []);

// Debounce resize events
useEffect(() => {
  const handleResize = debounce(() => {
    google.maps.event.trigger(map, "resize");
  }, 250);

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [map]);
```

## Security Best Practices

1. **Restrict API Key**: Don't use same key for backend
2. **Domain Restrictions**: Set allowed domains in Google Cloud Console
3. **Don't hardcode**: Always use environment variables
4. **Rate Limiting**: Implement on frontend to prevent abuse
5. **HTTPS Only**: Ensure site uses HTTPS in production

## Testing

```javascript
// Mock test for Maps component
test("renders map container", () => {
  render(<LocationContact />);
  expect(screen.getByRole("region")).toBeInTheDocument();
});

// Test business hours render
test("displays business hours", () => {
  render(<LocationContact />);
  expect(screen.getByText(/Monday - Friday/)).toBeInTheDocument();
});
```

## Resources

- [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)
- [Styling Wizard](https://mapstyle.withgoogle.com/)
- [Places Library](https://developers.google.com/maps/documentation/javascript/places)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [SEO_OPTIMIZATION_GUIDE.md](SEO_OPTIMIZATION_GUIDE.md) - Maps integration with SEO
- [SEO_INSTALLATION_GUIDE.md](SEO_INSTALLATION_GUIDE.md) - Complete SEO setup

---

**Tip**: Use [Snazzy Maps](https://snazzymaps.com) for pre-built styles that match your brand!

**SEO Tip**: Accurate business location and hours improve local search visibility. Keep your Maps location and JSON-LD LocalBusiness schema in sync!
