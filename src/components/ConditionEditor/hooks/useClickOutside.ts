import { RefObject, useEffect } from 'react';

/**
 * Custom hook that handles clicks outside of a specified element
 * 
 * This hook is useful for implementing dismissible dropdowns, modals, or any UI element
 * that should close when clicking outside of it. It attaches a mousedown event listener
 * to the document and checks if the click occurred outside the referenced element.
 * 
 * @param ref - React ref object pointing to the element to monitor
 * @param handler - Callback function to execute when a click outside occurs
 * 
 * @example
 * const MyComponent = () => {
 *   const ref = useRef(null);
 *   useClickOutside(ref, () => {
 *     // Handle click outside, e.g., close dropdown
 *     setIsOpen(false);
 *   });
 *   
 *   return <div ref={ref}>Content to monitor</div>;
 * };
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    /**
     * Event handler that checks if the click occurred outside the referenced element
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Attach the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove the event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
}; 