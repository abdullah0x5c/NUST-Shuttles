/**
 * StatusPanel Component
 * 
 * A sidebar/bottom panel that lists all shuttles with their current status.
 * Clicking a shuttle in the panel selects it and shows its route on the map.
 */

import React from 'react';
import ShuttleCard from './ShuttleCard';
import './StatusPanel.css';

/**
 * StatusPanel component
 * 
 * @param {Object} props
 * @param {Array} props.shuttles - Array of shuttle objects
 * @param {string|null} props.selectedShuttleId - Currently selected shuttle ID
 * @param {Function} props.onShuttleSelect - Callback when shuttle is selected
 * @param {boolean} props.loading - Whether data is still loading
 */
function StatusPanel({ shuttles = [], selectedShuttleId, onShuttleSelect, loading }) {
  // Sort shuttles: active first, then by bus number
  const sortedShuttles = [...shuttles].sort((a, b) => {
    // Active shuttles come first
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    
    // Then sort by bus number
    const numA = parseInt(a.busNumber) || 0;
    const numB = parseInt(b.busNumber) || 0;
    return numA - numB;
  });

  // Count active and inactive shuttles
  const activeCount = shuttles.filter(s => s.isActive).length;
  const inactiveCount = shuttles.length - activeCount;

  return (
    <aside className="status-panel">
      {/* Panel header */}
      <div className="status-panel__header">
        <h2 className="status-panel__title">Shuttle Status</h2>
        <div className="status-panel__stats">
          <span className="status-panel__stat status-panel__stat--active">
            {activeCount} active
          </span>
          <span className="status-panel__stat status-panel__stat--inactive">
            {inactiveCount} inactive
          </span>
        </div>
      </div>

      {/* Shuttle list */}
      <div className="status-panel__list">
        {loading ? (
          // Loading skeleton
          <div className="status-panel__loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="status-panel__skeleton">
                <div className="status-panel__skeleton-circle"></div>
                <div className="status-panel__skeleton-lines">
                  <div className="status-panel__skeleton-line"></div>
                  <div className="status-panel__skeleton-line status-panel__skeleton-line--short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shuttles.length === 0 ? (
          // No shuttles state
          <div className="status-panel__empty">
            <span className="status-panel__empty-icon">🚌</span>
            <p className="status-panel__empty-text">No shuttles available</p>
            <p className="status-panel__empty-hint">
              Check back later or refresh the page
            </p>
          </div>
        ) : (
          // Shuttle cards
          sortedShuttles.map(shuttle => (
            <ShuttleCard
              key={shuttle.id}
              shuttle={shuttle}
              isSelected={shuttle.id === selectedShuttleId}
              onSelect={() => onShuttleSelect(shuttle.id)}
            />
          ))
        )}
      </div>

      {/* Panel footer with hint */}
      {shuttles.length > 0 && (
        <div className="status-panel__footer">
          <p className="status-panel__hint">
            💡 Click a shuttle to view its route on the map
          </p>
        </div>
      )}

      {/* Made with love footer */}
      <div className="status-panel__credits">
        <a 
          href="https://abdullah0x5c.github.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="credits__link"
          title="Abdullah Raja"
        >
          made with ❤️
        </a>
      </div>
    </aside>
  );
}

export default StatusPanel;

