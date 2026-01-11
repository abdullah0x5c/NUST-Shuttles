/**
 * Map Configuration for NUST H-12 Islamabad Campus
 * 
 * This file contains all the geographical settings for the map,
 * including the center point, zoom levels, and boundary restrictions.
 */

// NUST H-12 Campus center coordinates
// Located in Sector H-12, Islamabad, Pakistan
export const CAMPUS_CENTER = {
  lat: 33.6425,
  lng: 72.9890
};

// Map zoom configuration
export const ZOOM_CONFIG = {
  default: 15,    // Initial zoom level when map loads
  min: 14,        // Minimum zoom (most zoomed out)
  max: 18         // Maximum zoom (most zoomed in)
};

// Campus boundary box - restricts the map view to NUST area
// This prevents users from panning too far away from the campus
export const CAMPUS_BOUNDS = [
  [33.628, 72.975],   // Southwest corner (bottom-left)
  [33.658, 73.010]    // Northeast corner (top-right)
];

// Tile layer configuration - using CartoDB dark theme for modern look
// OpenStreetMap tiles are free and don't require an API key
export const TILE_CONFIG = {
  // Dark themed tiles that match our app's aesthetic
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  
  // Alternative: Standard OpenStreetMap (lighter theme)
  // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  // attribution: '&copy; OpenStreetMap contributors'
};

// Route line styling
export const ROUTE_STYLE = {
  color: '#58a6ff',      // Blue color matching our accent
  weight: 4,             // Line thickness
  opacity: 0.8,          // Slight transparency
  dashArray: null,       // Solid line (use '10, 10' for dashed)
  lineCap: 'round',      // Rounded line ends
  lineJoin: 'round'      // Rounded line corners
};

// Marker icon sizes
export const MARKER_SIZE = {
  width: 40,
  height: 40,
  anchorX: 20,    // Horizontal anchor point (center)
  anchorY: 40     // Vertical anchor point (bottom)
};

