/**
 * useShuttles Hook - Real-time Shuttle Data Management
 * 
 * This custom React hook handles:
 * - Subscribing to Firebase real-time updates
 * - Managing loading and error states
 * - Cleaning up subscriptions when component unmounts
 * 
 * This is a "custom hook" - a reusable piece of logic that can be
 * shared across multiple components. Hooks in React always start with "use".
 */

import { useState, useEffect } from 'react';
import { subscribeToShuttles, isShuttleActive } from '../services/firebase';

/**
 * Hook to get real-time shuttle data from Firebase
 * 
 * @returns {Object} Object containing:
 *   - shuttles: Array of shuttle objects
 *   - loading: Boolean indicating if initial data is loading
 *   - error: Error message if something went wrong
 *   - lastUpdated: Date object of last data update
 * 
 * @example
 * function MyComponent() {
 *   const { shuttles, loading, error } = useShuttles();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return shuttles.map(shuttle => <div>{shuttle.busNumber}</div>);
 * }
 */
export function useShuttles() {
  // State to hold the array of shuttles
  const [shuttles, setShuttles] = useState([]);
  
  // Loading state - true until we get first data from Firebase
  const [loading, setLoading] = useState(true);
  
  // Error state - holds error message if something goes wrong
  const [error, setError] = useState(null);
  
  // Track when data was last updated
  const [lastUpdated, setLastUpdated] = useState(null);

  // useEffect runs when component mounts and cleans up when it unmounts
  useEffect(() => {
    // Subscribe to real-time shuttle updates
    // This function returns an "unsubscribe" function we'll use for cleanup
    const unsubscribe = subscribeToShuttles((data) => {
      // Process each shuttle to add computed properties
      const processedShuttles = data.map(shuttle => ({
        ...shuttle,
        // Add a computed 'isActive' property for easy access
        isActive: isShuttleActive(shuttle),
        // Format the route path for Leaflet (needs [lat, lng] arrays)
        routePath: formatRoutePath(shuttle.route)
      }));
      
      // Update our state with the new data
      setShuttles(processedShuttles);
      setLoading(false);
      setLastUpdated(new Date());
      setError(null);
    });

    // Cleanup function - called when component unmounts
    // This prevents memory leaks by stopping the Firebase listener
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Return all the state values for components to use
  return {
    shuttles,
    loading,
    error,
    lastUpdated,
    // Computed values
    activeCount: shuttles.filter(s => s.isActive).length,
    totalCount: shuttles.length
  };
}

/**
 * Format route path data for Leaflet Polyline
 * 
 * Firebase stores routes as an array of {latitude, longitude} objects.
 * Leaflet needs them as [[lat, lng], [lat, lng], ...] arrays.
 * 
 * @param {Array} route - Route data from Firebase
 * @returns {Array} Array of [lat, lng] coordinate pairs
 */
function formatRoutePath(route) {
  // If no route data, return empty array
  if (!route || !Array.isArray(route)) {
    return [];
  }

  // Find the first route with a path
  // Routes can have multiple segments (from -> to)
  for (const segment of route) {
    if (segment && segment.path && Array.isArray(segment.path)) {
      // Convert each point to [lat, lng] format
      // Note: Firebase data uses 'lat' and 'lng' keys (not latitude/longitude)
      return segment.path
        .filter(point => point && (point.lat || point.latitude) && (point.lng || point.longitude))
        .map(point => [
          parseFloat(point.lat || point.latitude),
          parseFloat(point.lng || point.longitude)
        ]);
    }
  }

  return [];
}

// Default export for convenience
export default useShuttles;

