/**
 * Utility functions for coordinate transformations and calculations
 */

/**
 * Calculate distance between two coordinates in kilometers
 * @param {Array} coord1 - [longitude, latitude]
 * @param {Array} coord2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
export function calculateDistance([lon1, lat1], [lon2, lat2]) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians
 * @returns {number} Degrees
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Get bounding box for a set of coordinates
 * @param {Array} coordinates - Array of [longitude, latitude] pairs
 * @returns {Object} Bounding box {minLon, maxLon, minLat, maxLat}
 */
export function getBoundingBox(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 };
  }

  const lons = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);

  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats)
  };
}

/**
 * Calculate center point of coordinates
 * @param {Array} coordinates - Array of [longitude, latitude] pairs
 * @returns {Array} Center [longitude, latitude]
 */
export function getCenterPoint(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return [0, 0];
  }

  const bbox = getBoundingBox(coordinates);
  return [
    (bbox.minLon + bbox.maxLon) / 2,
    (bbox.minLat + bbox.maxLat) / 2
  ];
}

/**
 * Generate random coordinates within bounds
 * @param {number} count - Number of coordinates to generate
 * @param {Object} bounds - {minLon, maxLon, minLat, maxLat}
 * @returns {Array} Array of [longitude, latitude] pairs
 */
export function generateRandomCoordinates(count, bounds = {}) {
  const {
    minLon = -180,
    maxLon = 180,
    minLat = -90,
    maxLat = 90
  } = bounds;

  return Array.from({ length: count }, () => [
    minLon + Math.random() * (maxLon - minLon),
    minLat + Math.random() * (maxLat - minLat)
  ]);
}
