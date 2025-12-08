import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to manage globe controls and auto-rotation
 * @param {boolean} autoRotate - Enable/disable auto-rotation
 * @param {Function} setViewState - State setter for view state
 * @returns {Object} Control handlers
 */
export function useGlobeControls(autoRotate = true, setViewState) {
  const rotationRef = useRef(null);
  const isInteractingRef = useRef(false);

  // Handle view state changes
  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
    
    // Stop auto-rotation when user interacts
    if (autoRotate) {
      isInteractingRef.current = true;
      
      // Resume auto-rotation after 3 seconds of inactivity
      if (rotationRef.current) {
        clearTimeout(rotationRef.current);
      }
      
      rotationRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);
    }
  }, [autoRotate, setViewState]);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      if (!isInteractingRef.current) {
        setViewState(prevState => ({
          ...prevState,
          longitude: (prevState.longitude + 0.1) % 360
        }));
      }
    }, 50);

    return () => {
      clearInterval(interval);
      if (rotationRef.current) {
        clearTimeout(rotationRef.current);
      }
    };
  }, [autoRotate, setViewState]);

  return {
    handleViewStateChange
  };
}
