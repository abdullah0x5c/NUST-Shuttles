# 🚌 NUST Shuttles Web App

A minimalistic, real-time shuttle tracking web application for NUST H-12 Islamabad campus.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)
![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?logo=firebase)

## Features

- 🗺️ **Interactive Map** - Focused on H-12 Islamabad sector
- 📍 **Real-time Tracking** - Live shuttle positions via Firebase
- 🛤️ **Route Display** - Click a shuttle to see its route
- 🟢 **Status Indicators** - Active/inactive shuttle status
- 📱 **Responsive Design** - Works on desktop and mobile

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn

### Installation

```bash
# Navigate to the web-app folder
cd web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment.

## Project Structure

```
web-app/
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app component
    ├── App.css             # App-specific styles
    ├── index.css           # Global styles & CSS variables
    ├── components/
    │   ├── Header/         # Top navigation bar
    │   ├── Map/            # Map, markers, routes
    │   └── StatusPanel/    # Shuttle list sidebar
    ├── hooks/
    │   └── useShuttles.js  # Firebase data hook
    ├── services/
    │   └── firebase.js     # Firebase configuration
    └── config/
        └── mapConfig.js    # Map settings & bounds
```

## How It Works

### Data Flow

1. **Firebase Realtime Database** stores all shuttle data
2. **useShuttles hook** subscribes to real-time updates
3. **App component** manages state and passes data to children
4. **MapView** renders markers for each shuttle
5. **StatusPanel** shows a list of all shuttles
6. **Click a shuttle** → Route polyline appears on map

### Key Concepts

- **Real-time Updates**: Uses Firebase's `onValue` listener for live data
- **Selective Route Display**: Routes only appear when a shuttle is selected
- **Responsive Layout**: Map + sidebar on desktop, stacked on mobile

## Configuration

### Map Bounds

The map is restricted to the NUST H-12 campus area. Modify in `src/config/mapConfig.js`:

```javascript
export const CAMPUS_BOUNDS = [
  [33.628, 72.975],   // Southwest corner
  [33.658, 73.010]    // Northeast corner
];
```

### Firebase

The Firebase configuration uses the same database as the official NUST Shuttles app. See `src/services/firebase.js`.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag & drop the 'dist' folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist folder contents to gh-pages branch
```

## License

This project is for educational purposes. The shuttle data comes from the official NUST Shuttles application.

---

Made with ❤️ for NUST students

