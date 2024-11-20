import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for managing editor layout and resizing functionality
 * 
 * This hook provides state and handlers for implementing a resizable split view
 * between the editor and preview panels. It handles:
 * - Mouse drag operations for resizing
 * - Position constraints (20-80% range)
 * - Cleanup of event listeners
 * - Reference to the editor container
 * 
 * @returns {Object} Layout state and handlers
 * @property isDragging - Boolean flag indicating if resize is in progress
 * @property splitPosition - Current position of the split (percentage)
 * @property editorRef - Reference to the editor container element
 * @property handleMouseDown - Handler to initiate resize operation
 * 
 * @example
 * const {
 *   isDragging,
 *   splitPosition,
 *   editorRef,
 *   handleMouseDown
 * } = useEditorLayout();
 */
export const useEditorLayout = () => {
  // State for tracking drag operation and split position
  const [isDragging, setIsDragging] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  
  // Reference to the editor container element
  const editorRef = useRef<HTMLDivElement>(null);

  /**
   * Effect for handling mouse movement during resize
   * Only active when dragging is in progress
   */
  useEffect(() => {
    if (!isDragging) return;

    /**
     * Handles mouse movement during resize
     * Calculates new split position based on mouse position
     * Constrains position between 20% and 80%
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!editorRef.current) return;
      const editorRect = editorRef.current.getBoundingClientRect();
      const position = ((e.clientX - editorRect.left) / editorRect.width) * 100;
      setSplitPosition(Math.min(Math.max(position, 20), 80));
    };

    /**
     * Handles end of resize operation
     * Cleans up by removing event listeners
     */
    const handleMouseUp = () => setIsDragging(false);

    // Attach event listeners for drag operation
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup event listeners when dragging stops or component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  /**
   * Handler for initiating resize operation
   * Sets dragging state to true when resize handle is clicked
   */
  const handleMouseDown = () => setIsDragging(true);

  return {
    isDragging,
    splitPosition,
    editorRef,
    handleMouseDown
  };
}; 