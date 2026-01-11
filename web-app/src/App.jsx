/**
 * App Component - Main Application Entry Point
 * 
 * This is the root component that brings together all parts of the
 * NUST Shuttles tracking application:
 * - Header with live status
 * - Map view with shuttle markers
 * - Status panel with shuttle list
 * 
 * The app uses a simple state management approach:
 * - useShuttles hook manages all shuttle data from Firebase
 * - selectedShuttleId state tracks which shuttle is selected
 * - When a shuttle is selected, its route is shown on the map
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/Map';
import { StatusPanel } from './components/StatusPanel';
import { useShuttles } from './hooks/useShuttles';
import './App.css';

function App() {
  // Get real-time shuttle data from Firebase
  // This hook handles all the subscription logic and data processing
  const { 
    shuttles,        // Array of all shuttles
    loading,         // True while initial data is loading
    error,           // Error message if something went wrong
    lastUpdated,     // Date of last data update
    activeCount,     // Number of active shuttles
    totalCount       // Total number of shuttles
  } = useShuttles();

  // Track which shuttle is currently selected
  // null means no shuttle is selected
  const [selectedShuttleId, setSelectedShuttleId] = useState(null);

  /**
   * Handle shuttle selection/deselection
   * 
   * @param {string|null} shuttleId - ID of shuttle to select, or null to deselect
   */
  const handleShuttleSelect = (shuttleId) => {
    // If clicking the same shuttle, deselect it (toggle behavior)
    if (shuttleId === selectedShuttleId) {
      setSelectedShuttleId(null);
    } else {
      setSelectedShuttleId(shuttleId);
    }
  };

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="app app--error">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h2>Unable to Load Shuttles</h2>
          <p>{error}</p>
          <button 
            className="error-retry" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header with live status indicator */}
      <Header 
        activeCount={activeCount}
        totalCount={totalCount}
        lastUpdated={lastUpdated}
      />

      {/* Main content area */}
      <main className="app__main">
        {/* Map container - takes most of the screen */}
        <MapView 
          shuttles={shuttles}
          selectedShuttleId={selectedShuttleId}
          onShuttleSelect={handleShuttleSelect}
        />

        {/* Status panel - sidebar on desktop, bottom panel on mobile */}
        <StatusPanel 
          shuttles={shuttles}
          selectedShuttleId={selectedShuttleId}
          onShuttleSelect={handleShuttleSelect}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;

