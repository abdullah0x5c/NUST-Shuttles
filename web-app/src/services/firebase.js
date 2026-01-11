/**
 * Firebase Configuration and Database Service
 * 
 * This file sets up the connection to Firebase Realtime Database
 * where all shuttle location data is stored and updated in real-time.
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration extracted from the NUST Shuttles APK
// These credentials connect us to the official NUST Shuttles database
const firebaseConfig = {
  apiKey: "AIzaSyB4EG8JBR9syDy5O_4xTbhrYEqB531bVY0",
  databaseURL: "https://nust-shuttles-default-rtdb.firebaseio.com",
  projectId: "nust-shuttles",
  storageBucket: "nust-shuttles.appspot.com",
  appId: "1:733900677144:android:40c115401e1e020134e36d"
};

// Initialize Firebase app
// This creates a connection to the Firebase backend
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
// This is where all shuttle data lives
const database = getDatabase(app);

/**
 * Subscribe to real-time shuttle updates
 * 
 * This function sets up a listener that will be called
 * every time the shuttle data changes in Firebase.
 * 
 * @param {Function} callback - Function to call with shuttle data
 * @returns {Function} Unsubscribe function to stop listening
 * 
 * @example
 * const unsubscribe = subscribeToShuttles((shuttles) => {
 *   console.log('Shuttles updated:', shuttles);
 * });
 * 
 * // Later, when component unmounts:
 * unsubscribe();
 */
export function subscribeToShuttles(callback) {
  // Create a reference to the ROOT of the database
  // Note: The NUST Shuttles data is stored at the root level, not under '/shuttles'
  const shuttlesRef = ref(database);
  
  // Set up the real-time listener
  // onValue fires immediately with current data, then again on any changes
  onValue(shuttlesRef, (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
      // Convert the Firebase object to an array of shuttles
      // Firebase stores data as { shuttleId1: {...}, shuttleId2: {...} }
      // We convert it to [{ id: 'shuttleId1', ... }, { id: 'shuttleId2', ... }]
      const shuttlesArray = Object.entries(data).map(([id, shuttle]) => ({
        id,
        ...shuttle,
        // Parse coordinates as numbers (they come as strings from Firebase)
        latitude: parseFloat(shuttle.latitude) || 0,
        longitude: parseFloat(shuttle.logitude) || 0,  // Note: typo in original data
        prevLat: parseFloat(shuttle.prevLat) || 0,
        prevLong: parseFloat(shuttle.prevLong) || 0,
        speed: parseFloat(shuttle.speed) || 0
      }));
      
      callback(shuttlesArray);
    } else {
      // No data available - return empty array
      callback([]);
    }
  }, (error) => {
    // Handle any errors (e.g., permission denied)
    console.error('Firebase error:', error);
    callback([]);
  });
  
  // Return a function to unsubscribe from updates
  // This is important for cleanup when the component unmounts
  return () => {
    off(shuttlesRef);
  };
}

/**
 * Check if a shuttle is currently active
 * 
 * A shuttle is considered active if:
 * - Its activeStatus is 'active' or similar
 * - OR it was last active within the last 5 minutes
 * 
 * @param {Object} shuttle - Shuttle object from Firebase
 * @returns {boolean} True if shuttle is active
 */
export function isShuttleActive(shuttle) {
  // Check the activeStatus field first
  if (shuttle.activeStatus) {
    const status = shuttle.activeStatus.toLowerCase();
    if (status === 'active' || status === 'true' || status === '1') {
      return true;
    }
  }
  
  // Fallback: check if last active time is within 5 minutes
  // Note: Firebase stores lastActiveTime as a Unix timestamp string (milliseconds)
  if (shuttle.lastActiveTime && shuttle.lastActiveTime !== '0') {
    const timestamp = parseInt(shuttle.lastActiveTime, 10);
    if (!isNaN(timestamp)) {
      const lastActive = new Date(timestamp);
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      return (now - lastActive) < fiveMinutes;
    }
  }
  
  return false;
}

// Export database instance for advanced usage if needed
export { database };

