/**
 * MapView Component
 * 
 * The main map container that displays the H-12 Islamabad sector.
 * Uses react-leaflet to render an interactive map with shuttle markers.
 */

import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import ShuttleMarker from './ShuttleMarker';
import RoutePolyline from './RoutePolyline';
import { 
  CAMPUS_CENTER, 
  ZOOM_CONFIG, 
  CAMPUS_BOUNDS, 
  TILE_CONFIG 
} from '../../config/mapConfig';
import './MapView.css';

/**
 * Component to handle map bounds restriction
 * This keeps the map view within the NUST campus area
 */
function MapBoundsHandler() {
  const map = useMap();
  
  React.useEffect(() => {
    // Restrict panning to campus bounds
    map.setMaxBounds(CAMPUS_BOUNDS);
    map.on('drag', () => {
      map.panInsideBounds(CAMPUS_BOUNDS, { animate: false });
    });
  }, [map]);
  
  return null;
}

/**
 * Main MapView component
 * 
 * @param {Object} props
 * @param {Array} props.shuttles - Array of shuttle objects to display
 * @param {string|null} props.selectedShuttleId - ID of currently selected shuttle
 * @param {Function} props.onShuttleSelect - Callback when a shuttle is clicked
 */
function MapView({ shuttles = [], selectedShuttleId, onShuttleSelect }) {
  // Find the currently selected shuttle for route display
  const selectedShuttle = shuttles.find(s => s.id === selectedShuttleId);

  /**
   * Handle click on the map background (not on a marker)
   * This deselects any currently selected shuttle
   */
  const handleMapClick = () => {
    if (selectedShuttleId) {
      onShuttleSelect(null);
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
        zoom={ZOOM_CONFIG.default}
        minZoom={ZOOM_CONFIG.min}
        maxZoom={ZOOM_CONFIG.max}
        className="map"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Map tiles - the visual layer of the map */}
        <TileLayer
          url={TILE_CONFIG.url}
          attribution={TILE_CONFIG.attribution}
        />
        
        {/* Bounds handler to restrict map to campus area */}
        <MapBoundsHandler />
        
        {/* Click handler for map background */}
        <MapClickHandler onClick={handleMapClick} />
        
        {/* Route polyline - only shown when a shuttle is selected */}
        {selectedShuttle && selectedShuttle.routePath && (
          <RoutePolyline 
            path={selectedShuttle.routePath}
            shuttleInfo={selectedShuttle}
          />
        )}
        
        {/* Shuttle markers */}
        {shuttles.map((shuttle) => (
          <ShuttleMarker
            key={shuttle.id}
            shuttle={shuttle}
            isSelected={shuttle.id === selectedShuttleId}
            onSelect={() => onShuttleSelect(shuttle.id)}
          />
        ))}
      </MapContainer>
      
      {/* Map legend */}
      <div className="map-legend">
        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--active"></span>
          <span>Active</span>
        </div>
        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--inactive"></span>
          <span>Inactive</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper component to handle map click events
 * react-leaflet requires hooks to be used inside MapContainer
 */
function MapClickHandler({ onClick }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  
  return null;
}

export default MapView;

