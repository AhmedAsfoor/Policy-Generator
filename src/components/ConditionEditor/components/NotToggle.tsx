import React from 'react';

/**
 * Props interface for the NotToggle component
 * @property checked - Boolean state of the NOT operator toggle
 * @property onChange - Callback function triggered when the toggle state changes
 */
interface NotToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * NotToggle component for toggling logical NOT operations
 * 
 * This component renders a specialized checkbox that toggles the NOT operator
 * in logical conditions. It's used within the Condition Editor to negate
 * condition statements when needed.
 * 
 * @example
 * <NotToggle
 *   checked={isNegated}
 *   onChange={handleNotToggle}
 * />
 */
export const NotToggle: React.FC<NotToggleProps> = ({ checked, onChange }) => (
  <label className="not-checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      title="Toggle NOT operator"
      className="not-checkbox-input"
    />
    <span className="not-checkbox-label">NOT</span>
  </label>
); 