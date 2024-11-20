import React from 'react';
import '../../../styles/PolicyEditor.css';

/**
 * Props interface for the Dropdown component
 * @property isOpen - Boolean flag controlling the visibility of the dropdown
 * @property position - Object containing top and left coordinates for positioning
 * @property width - Optional width of the dropdown in pixels
 * @property onScroll - Optional callback function triggered on dropdown content scroll
 * @property children - React components to be rendered inside the dropdown
 */
interface DropdownProps {
  isOpen: boolean;
  position: { top: number; left: number };
  width?: number;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

/**
 * Dropdown component for displaying floating content
 * 
 * This component renders a positioned dropdown container that can be used for
 * displaying various content like menus, options lists, or other floating UI elements.
 * It supports absolute positioning and optional width configuration.
 * 
 * @example
 * <Dropdown
 *   isOpen={true}
 *   position={{ top: 100, left: 200 }}
 *   width={300}
 *   onScroll={handleScroll}
 * >
 *   <div>Dropdown content</div>
 * </Dropdown>
 */
export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  position,
  width,
  onScroll,
  children
}) => {
  // Early return if dropdown should not be visible
  if (!isOpen) return null;

  return (
    <div 
      className="field-options" 
      onScroll={onScroll}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: width
      }}
    >
      {children}
    </div>
  );
}; 