/**
 * RoutePolyline Component
 * 
 * Renders the route path for a selected shuttle on the map.
 * Only visible when a shuttle is selected (clicked/tapped).
 * 
 * This component draws a line on the map showing the shuttle's
 * defined route, with optional start and end markers.
 */

import React from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { ROUTE_STYLE } from '../../config/mapConfig';

/**
 * RoutePolyline component
 * 
 * @param {Object} props
 * @param {Array} props.path - Array of [lat, lng] coordinates
 * @param {Object} props.shuttleInfo - Shuttle data for route info
 */
function RoutePolyline({ path, shuttleInfo }) {
  // Don't render if no path data
  if (!path || path.length < 2) {
    return null;
  }

  // Get start and end points
  const startPoint = path[0];
  const endPoint = path[path.length - 1];

  // Get route names for tooltips
  const getRouteName = () => {
    if (shuttleInfo?.route && shuttleInfo.route[0]) {
      const route = shuttleInfo.route[0];
      return {
        from: route.from || 'Start',
        to: route.to || 'End',
        title: route.title || 'Route'
      };
    }
    return { from: 'Start', to: 'End', title: 'Route' };
  };

  const routeNames = getRouteName();

  return (
    <>
      {/* Main route line */}
      <Polyline
        positions={path}
        pathOptions={{
          ...ROUTE_STYLE,
          // Add animation effect with dash pattern
          className: 'route-line-animated'
        }}
      />
      
      {/* Route glow effect (thicker, more transparent line behind) */}
      <Polyline
        positions={path}
        pathOptions={{
          color: ROUTE_STYLE.color,
          weight: ROUTE_STYLE.weight + 6,
          opacity: 0.2,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />

      {/* Start point marker */}
      <CircleMarker
        center={startPoint}
        radius={8}
        pathOptions={{
          fillColor: '#3fb950',
          fillOpacity: 1,
          color: '#ffffff',
          weight: 2
        }}
      >
        <Tooltip direction="top" offset={[0, -10]} permanent={false}>
          <span>🚏 {routeNames.from}</span>
        </Tooltip>
      </CircleMarker>

      {/* End point marker */}
      <CircleMarker
        center={endPoint}
        radius={8}
        pathOptions={{
          fillColor: '#f85149',
          fillOpacity: 1,
          color: '#ffffff',
          weight: 2
        }}
      >
        <Tooltip direction="top" offset={[0, -10]} permanent={false}>
          <span>📍 {routeNames.to}</span>
        </Tooltip>
      </CircleMarker>
    </>
  );
}

export default RoutePolyline;

