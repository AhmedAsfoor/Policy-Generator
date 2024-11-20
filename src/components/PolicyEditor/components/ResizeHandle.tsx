import React from 'react';

/**
 * Props interface for the ResizeHandle component
 * @property isDragging - Boolean flag indicating if the handle is currently being dragged
 * @property onMouseDown - Callback function to initiate resize operation
 */
interface ResizeHandleProps {
  isDragging: boolean;
  onMouseDown: () => void;
}

/**
 * ResizeHandle component for adjusting split view dimensions
 * 
 * This component provides a draggable handle that allows users to resize
 * split view panels. It's typically used between editor and preview sections
 * to allow users to adjust the relative sizes of the panels.
 * 
 * The component applies a visual indicator when being dragged and
 * triggers the resize operation through the onMouseDown callback.
 * 
 * @example
 * <ResizeHandle
 *   isDragging={isDragging}
 *   onMouseDown={() => startResizing()}
 * />
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  isDragging,
  onMouseDown
}) => (
  <div 
    className={`resize-handle ${isDragging ? 'dragging' : ''}`}
    onMouseDown={onMouseDown}
  />
); 