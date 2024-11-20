import { useState, useEffect, RefObject, useCallback, useMemo } from 'react';
import { useDropdownPosition } from './useDropdownPosition';

/**
 * Return type interface for the useDropdown hook
 * @property isOpen - Boolean flag indicating if the dropdown is visible
 * @property searchTerm - Current search input value
 * @property displayCount - Number of items currently displayed
 * @property position - Calculated position for the dropdown
 * @property setIsOpen - Function to control dropdown visibility
 * @property setSearchTerm - Function to update search term
 * @property setDisplayCount - Function to update number of displayed items
 * @property handleInputFocus - Function to handle input focus events
 * @property handleScroll - Function to handle dropdown scroll events
 * @property currentValue - Current selected value
 * @property setCurrentValue - Function to update selected value
 * @property handleBlur - Function to handle input blur events
 */
interface UseDropdownReturn {
  isOpen: boolean;
  searchTerm: string;
  displayCount: number;
  position: { top: number; left: number };
  setIsOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  setDisplayCount: (count: number) => void;
  handleInputFocus: () => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  currentValue: string;
  setCurrentValue: (value: string) => void;
  handleBlur: (onValueChange: (value: string) => void) => void;
}

/**
 * Custom hook for managing dropdown state and behavior
 * 
 * This hook provides comprehensive dropdown functionality including:
 * - Search functionality
 * - Infinite scroll
 * - Position calculation
 * - Focus/blur handling
 * - Value management
 * 
 * @param inputRef - Reference to the input element
 * @param itemsPerPage - Number of items to display per page
 * @param totalItems - Total number of items available
 * @param initialValue - Initial selected value
 * @returns UseDropdownReturn object with dropdown state and handlers
 * 
 * @example
 * const {
 *   isOpen,
 *   searchTerm,
 *   position,
 *   handleInputFocus,
 *   handleScroll
 * } = useDropdown(inputRef, 10, 100, '');
 */
export const useDropdown = (
  inputRef: RefObject<HTMLElement>,
  itemsPerPage: number,
  totalItems: number,
  initialValue: string = ''
): UseDropdownReturn => {
  // Initialize state with default values
  const [state, setState] = useState({
    isOpen: false,
    searchTerm: '',
    displayCount: itemsPerPage,
    currentValue: initialValue
  });

  // Get dropdown position using custom hook
  const [position, updatePosition] = useDropdownPosition(inputRef, state.isOpen);

  /**
   * State update handlers
   */
  const setIsOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }));
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  }, []);

  const setDisplayCount = useCallback((displayCount: number) => {
    setState(prev => ({ ...prev, displayCount }));
  }, []);

  const setCurrentValue = useCallback((currentValue: string) => {
    setState(prev => ({ ...prev, currentValue }));
  }, []);

  /**
   * Handles input focus event
   * Opens the dropdown and resets search term
   */
  const handleInputFocus = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true, searchTerm: '' }));
    updatePosition();
  }, [updatePosition]);

  /**
   * Handles dropdown scroll event for infinite scrolling
   * Increases display count when user scrolls near bottom
   */
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setState(prev => ({
        ...prev,
        displayCount: Math.min(prev.displayCount + itemsPerPage, totalItems)
      }));
    }
  }, [itemsPerPage, totalItems]);

  /**
   * Handles input blur event
   * Updates value and closes dropdown after a short delay
   */
  const handleBlur = useCallback((onValueChange: (value: string) => void) => {
    setTimeout(() => {
      setState(prev => {
        if (prev.searchTerm) {
          onValueChange(prev.searchTerm);
          return {
            ...prev,
            isOpen: false,
            currentValue: prev.searchTerm,
            searchTerm: ''
          };
        }
        return { ...prev, isOpen: false, searchTerm: '' };
      });
    }, 200);
  }, []);

  // Update current value when initialValue changes
  useEffect(() => {
    setState(prev => ({ ...prev, currentValue: initialValue }));
  }, [initialValue]);

  // Memoize return value to prevent unnecessary rerenders
  return useMemo(() => ({
    ...state,
    position,
    setIsOpen,
    setSearchTerm,
    setDisplayCount,
    setCurrentValue,
    handleInputFocus,
    handleScroll,
    handleBlur
  }), [
    state,
    position,
    setIsOpen,
    setSearchTerm,
    setDisplayCount,
    setCurrentValue,
    handleInputFocus,
    handleScroll,
    handleBlur
  ]);
}; 