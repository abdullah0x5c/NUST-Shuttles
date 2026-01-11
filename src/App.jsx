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

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/Map';
import { StatusPanel } from './components/StatusPanel';
import { useShuttles } from './hooks/useShuttles';
import './App.css';

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
  
  // Track the nearest shuttle (found via geolocation)
  const [nearestShuttleId, setNearestShuttleId] = useState(null);
  
  // Track if we're currently getting user's location
  const [isLocating, setIsLocating] = useState(false);

  /**
   * Handle shuttle selection/deselection
   * 
   * @param {string|null} shuttleId - ID of shuttle to select, or null to deselect
   */
  const handleShuttleSelect = (shuttleId) => {
    // If clicking the same shuttle, deselect it (toggle behavior)
    if (shuttleId === selectedShuttleId) {
      setSelectedShuttleId(null);
      setNearestShuttleId(null); // Clear nearest when deselecting
    } else {
      setSelectedShuttleId(shuttleId);
      // Clear nearest if selecting a different shuttle manually
      if (shuttleId !== nearestShuttleId) {
        setNearestShuttleId(null);
      }
    }
  };

  /**
   * Find the nearest active shuttle to the user's location
   * Uses the browser's Geolocation API to get user position
   */
  const handleFindNearest = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    // Get only active shuttles
    const activeShuttles = shuttles.filter(s => s.isActive);
    if (activeShuttles.length === 0) {
      alert('No active shuttles available');
      return;
    }

    setIsLocating(true);

    // Request user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Find the nearest active shuttle
        let nearestShuttle = null;
        let minDistance = Infinity;

        activeShuttles.forEach(shuttle => {
          // Shuttle has latitude and longitude directly on the object
          if (shuttle.latitude && shuttle.longitude) {
            const distance = calculateDistance(
              userLat, userLng,
              shuttle.latitude, shuttle.longitude
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestShuttle = shuttle;
            }
          }
        });

        if (nearestShuttle) {
          // Select the nearest shuttle and mark it as nearest
          setSelectedShuttleId(nearestShuttle.id);
          setNearestShuttleId(nearestShuttle.id);
        }

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please allow location access to find the nearest shuttle.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [shuttles]);

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
      {/* Header with live status indicator and find nearest button */}
      <Header 
        activeCount={activeCount}
        totalCount={totalCount}
        lastUpdated={lastUpdated}
        onFindNearest={handleFindNearest}
        isLocating={isLocating}
      />

      {/* Main content area */}
      <main className="app__main">
        {/* Map container - takes most of the screen */}
        <MapView 
          shuttles={shuttles}
          selectedShuttleId={selectedShuttleId}
          onShuttleSelect={handleShuttleSelect}
          nearestShuttleId={nearestShuttleId}
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

