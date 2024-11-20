import { useState, useEffect, RefObject, useCallback } from 'react';

/**
 * Interface for dropdown position coordinates
 * @property top - Vertical position in pixels from the top of the viewport
 * @property left - Horizontal position in pixels from the left of the viewport
 */
interface DropdownPosition {
  top: number;
  left: number;
}

/**
 * Custom hook for calculating and managing dropdown position
 * 
 * This hook handles the positioning logic for dropdowns, including:
 * - Calculating initial position based on the reference element
 * - Adjusting position based on available viewport space
 * - Updating position on scroll
 * - Handling window boundaries
 * 
 * @param inputRef - Reference to the element that triggers the dropdown
 * @param isOpen - Boolean flag indicating if the dropdown is visible
 * @returns Tuple containing current position and update function
 * 
 * @example
 * const [position, updatePosition] = useDropdownPosition(inputRef, isOpen);
 */
export const useDropdownPosition = (
  inputRef: RefObject<HTMLElement>,
  isOpen: boolean
): [DropdownPosition, () => void] => {
  // Initialize position state
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });

  /**
   * Calculates and updates the dropdown position
   * 
   * This function:
   * - Gets the triggering element's position
   * - Checks available space below the element
   * - Positions dropdown above or below based on available space
   * - Accounts for window scroll position
   */
  const updatePosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // If there's not enough space below (300px), position above
      const top = spaceBelow >= 300 
        ? rect.bottom + window.scrollY  // Position below
        : rect.top - 300 + window.scrollY; // Position above
      
      setPosition({
        top,
        left: rect.left + window.scrollX
      });
    }
  }, [inputRef]);

  /**
   * Effect to handle scroll events and initial positioning
   * Only active when dropdown is open
   */
  useEffect(() => {
    if (isOpen) {
      // Update position when any scrolling occurs
      const handleScroll = () => updatePosition();
      
      // Attach scroll listener to handle repositioning
      window.addEventListener('scroll', handleScroll, true);
      
      // Initial position calculation
      updatePosition();
      
      // Cleanup scroll listener
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen, updatePosition]);

  return [position, updatePosition];
}; 