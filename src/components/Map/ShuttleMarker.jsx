/**
 * ShuttleMarker Component
 * 
 * Renders an individual shuttle as a marker on the map.
 * Shows different icons for active/inactive status and
 * displays a popup with shuttle details when clicked.
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Create custom marker icons for shuttles
 * We use SVG icons embedded as data URLs for crisp rendering
 */
const createShuttleIcon = (isActive, isSelected) => {
  // Color based on status
  const color = isActive ? '#3fb950' : '#f85149';
  const glowColor = isActive ? 'rgba(63, 185, 80, 0.4)' : 'rgba(248, 81, 73, 0.4)';
  const size = isSelected ? 48 : 40;
  
  // SVG bus icon
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="11" fill="${glowColor}" ${isSelected ? 'filter="url(#glow)"' : ''}/>
      <circle cx="12" cy="12" r="10" fill="#1c2128" stroke="${color}" stroke-width="2"/>
      <path d="M17 8V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2M7 8h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8z" 
            fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="9" cy="16" r="1" fill="${color}"/>
      <circle cx="15" cy="16" r="1" fill="${color}"/>
      <line x1="7" y1="11" x2="17" y2="11" stroke="${color}" stroke-width="1"/>
    </svg>
  `;
  
  // Create Leaflet icon from SVG
  return L.divIcon({
    html: svg,
    className: 'shuttle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

/**
 * ShuttleMarker component
 * 
 * @param {Object} props
 * @param {Object} props.shuttle - Shuttle data object
 * @param {boolean} props.isSelected - Whether this shuttle is currently selected
 * @param {Function} props.onSelect - Callback when shuttle is clicked
 */
function ShuttleMarker({ shuttle, isSelected, onSelect }) {
  // Skip rendering if shuttle has no valid coordinates
  if (!shuttle.latitude || !shuttle.longitude || 
      shuttle.latitude === 0 || shuttle.longitude === 0) {
    return null;
  }

  // Get the appropriate icon based on status
  const icon = createShuttleIcon(shuttle.isActive, isSelected);

  // Format route title for display
  const getRouteTitle = () => {
    if (shuttle.route && shuttle.route[0]) {
      const route = shuttle.route[0];
      if (route.title) return route.title;
      if (route.from && route.to) return `${route.from} → ${route.to}`;
    }
    return 'Route not available';
  };

  // Format last active time
  // Note: Firebase stores this as a Unix timestamp string (milliseconds since epoch)
  const formatLastActive = () => {
    if (!shuttle.lastActiveTime || shuttle.lastActiveTime === '0') return 'Unknown';
    
    // Parse as Unix timestamp (milliseconds)
    const timestamp = parseInt(shuttle.lastActiveTime, 10);
    if (isNaN(timestamp)) return 'Unknown';
    
    const lastActive = new Date(timestamp);
    const now = new Date();
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return 'Just now'; // Handle future timestamps
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return lastActive.toLocaleDateString();
  };

  return (
    <Marker
      position={[shuttle.latitude, shuttle.longitude]}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          // Prevent map click handler from firing
          L.DomEvent.stopPropagation(e);
          onSelect();
        }
      }}
    >
      <Popup>
        <div className="shuttle-popup">
          <div className="shuttle-popup__header">
            <span className={`status-dot ${shuttle.isActive ? 'active' : 'inactive'}`}></span>
            <strong className="shuttle-popup__bus-number">
              Shuttle #{shuttle.busNumber || shuttle.id}
            </strong>
          </div>
          
          <div className="shuttle-popup__info">
            <div className="shuttle-popup__row">
              <span className="shuttle-popup__label">Route:</span>
              <span className="shuttle-popup__value">{getRouteTitle()}</span>
            </div>
            
            <div className="shuttle-popup__row">
              <span className="shuttle-popup__label">Speed:</span>
              <span className="shuttle-popup__value">{shuttle.speed || 0} km/h</span>
            </div>
            
            <div className="shuttle-popup__row">
              <span className="shuttle-popup__label">Status:</span>
              <span className={`shuttle-popup__status ${shuttle.isActive ? 'active' : 'inactive'}`}>
                {shuttle.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="shuttle-popup__row">
              <span className="shuttle-popup__label">Last seen:</span>
              <span className="shuttle-popup__value">{formatLastActive()}</span>
            </div>
          </div>
          
          {isSelected && shuttle.routePath && shuttle.routePath.length > 0 && (
            <div className="shuttle-popup__route-hint">
              📍 Route displayed on map
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default ShuttleMarker;

