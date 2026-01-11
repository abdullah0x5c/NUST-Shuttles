/**
 * Header Component
 * 
 * The top navigation bar of the application.
 * Shows the app title, live indicator, and refresh functionality.
 */

import React from 'react';
import './Header.css';

/**
 * Header component for the shuttle tracker
 * 
 * @param {Object} props
 * @param {number} props.activeCount - Number of currently active shuttles
 * @param {number} props.totalCount - Total number of shuttles
 * @param {Date} props.lastUpdated - When data was last received
 * @param {Function} props.onFindNearest - Callback when "Find Nearest" button is clicked
 * @param {boolean} props.isLocating - Whether we're currently getting user's location
 */
function Header({ activeCount = 0, totalCount = 0, lastUpdated, onFindNearest, isLocating = false }) {
  // Format the last updated time for display
  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="header">
      {/* Left section: Logo and title */}
      <div className="header__brand">
        <span className="header__icon">🚌</span>
        <div className="header__title-group">
          <h1 className="header__title">NUST Shuttles</h1>
          <span className="header__subtitle">H-12 Islamabad • Live Tracker</span>
        </div>
      </div>

      {/* Center section: Live status indicator */}
      <div className="header__status">
        <span className="header__live-dot"></span>
        <span className="header__live-text">LIVE</span>
        <span className="header__count">
          {activeCount}/{totalCount} Active
        </span>
      </div>

      {/* Find Nearest Shuttle button */}
      <button 
        className={`header__find-btn ${isLocating ? 'header__find-btn--loading' : ''}`}
        onClick={onFindNearest}
        disabled={isLocating || activeCount === 0}
        title="Find the nearest active shuttle to your location"
      >
        <span className="header__find-icon">{isLocating ? '⏳' : '📍'}</span>
        <span className="header__find-text">
          {isLocating ? 'Locating...' : 'Find Nearest Shuttle'}
        </span>
      </button>

      {/* Right section: Last updated time */}
      <div className="header__meta">
        <span className="header__updated">
          Updated: {formatTime(lastUpdated)}
        </span>
      </div>
    </header>
  );
}

export default Header;

