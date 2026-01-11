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
 */
function Header({ activeCount = 0, totalCount = 0, lastUpdated }) {
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

