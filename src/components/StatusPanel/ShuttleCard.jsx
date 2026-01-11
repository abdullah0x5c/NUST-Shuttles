/**
 * ShuttleCard Component
 * 
 * Individual shuttle card displayed in the StatusPanel.
 * Shows shuttle number, route, status, and speed at a glance.
 */

import React from 'react';

/**
 * ShuttleCard component
 * 
 * @param {Object} props
 * @param {Object} props.shuttle - Shuttle data object
 * @param {boolean} props.isSelected - Whether this shuttle is selected
 * @param {Function} props.onSelect - Callback when card is clicked
 */
function ShuttleCard({ shuttle, isSelected, onSelect }) {
  // Get route display text
  const getRouteText = () => {
    if (shuttle.route && shuttle.route[0]) {
      const route = shuttle.route[0];
      if (route.title) return route.title;
      if (route.from && route.to) return `${route.from} → ${route.to}`;
    }
    return 'No route assigned';
  };

  // Format last active time relative to now
  // Note: Firebase stores this as a Unix timestamp string (milliseconds since epoch)
  const getLastActiveText = () => {
    if (!shuttle.lastActiveTime || shuttle.lastActiveTime === '0') return '';
    
    // Parse as Unix timestamp (milliseconds)
    const timestamp = parseInt(shuttle.lastActiveTime, 10);
    if (isNaN(timestamp)) return '';
    
    const lastActive = new Date(timestamp);
    const now = new Date();
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return 'Active now'; // Handle future timestamps
    if (diffMins < 1) return 'Active now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return 'Offline';
  };

  return (
    <button
      className={`shuttle-card ${isSelected ? 'shuttle-card--selected' : ''} ${shuttle.isActive ? 'shuttle-card--active' : 'shuttle-card--inactive'}`}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Select shuttle ${shuttle.busNumber || shuttle.id}`}
    >
      {/* Status indicator */}
      <div className="shuttle-card__status">
        <span className={`status-dot ${shuttle.isActive ? 'active' : 'inactive'}`}></span>
      </div>

      {/* Main info */}
      <div className="shuttle-card__info">
        <div className="shuttle-card__header">
          <span className="shuttle-card__bus-number">
            Shuttle #{shuttle.busNumber || shuttle.id}
          </span>
          {shuttle.speed > 0 && (
            <span className="shuttle-card__speed">
              {Math.round(shuttle.speed)} km/h
            </span>
          )}
        </div>
        
        <div className="shuttle-card__route">
          {getRouteText()}
        </div>
        
        {!shuttle.isActive && (
          <div className="shuttle-card__last-active">
            {getLastActiveText()}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="shuttle-card__selected-indicator">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      )}
    </button>
  );
}

export default ShuttleCard;

