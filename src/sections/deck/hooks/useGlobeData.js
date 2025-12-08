import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook to manage and process globe data
 * @param {Array} properties - Raw property data
 * @returns {Object} Processed data for different layers
 */
export function useGlobeData(properties = []) {
  const [propertyData, setPropertyData] = useState([]);
  const [arcData, setArcData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  // Process property data
  useEffect(() => {
    if (properties.length > 0) {
      const processed = properties.map(prop => ({
        coordinates: [prop.longitude, prop.latitude],
        name: prop.name || 'Property',
        price: prop.price || 0,
        city: prop.city || 'Unknown',
        type: prop.type || 'residential',
        ...prop
      }));
      
      setPropertyData(processed);
      setHeatmapData(processed);
    }
  }, [properties]);

  // Generate arc data (connections between properties)
  useEffect(() => {
    if (propertyData.length > 1) {
      const arcs = [];
      
      // Create arcs between nearby properties
      for (let i = 0; i < propertyData.length - 1; i++) {
        for (let j = i + 1; j < propertyData.length; j++) {
          const distance = calculateDistance(
            propertyData[i].coordinates,
            propertyData[j].coordinates
          );
          
          // Only create arcs for properties within certain distance
          if (distance < 5000) { // 5000km
            arcs.push({
              from: propertyData[i].coordinates,
              to: propertyData[j].coordinates,
              value: Math.random() * 100
            });
          }
        }
      }
      
      setArcData(arcs.slice(0, 50)); // Limit to 50 arcs for performance
    }
  }, [propertyData]);

  return {
    propertyData,
    arcData,
    heatmapData
  };
}

// Helper function to calculate distance between two coordinates
function calculateDistance([lon1, lat1], [lon2, lat2]) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
