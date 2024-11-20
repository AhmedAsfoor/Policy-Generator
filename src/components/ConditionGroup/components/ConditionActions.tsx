import React from 'react';
import { ConditionActionsProps } from '../types';

/**
 * Props interface for the ConditionActions component
 * Imported from types file, typically includes:
 * @property index - Current condition index in the group
 * @property onMove - Callback function for moving condition up/down
 * @property onRemove - Callback function for removing the condition
 */

/**
 * ConditionActions component for managing condition ordering and removal
 * 
 * This component provides a set of action buttons that allow users to:
 * - Move conditions up in the list
 * - Move conditions down in the list
 * - Remove conditions from the group
 * 
 * The up button is automatically disabled for the first condition (index 0)
 * 
 * @example
 * <ConditionActions
 *   index={2}
 *   onMove={(direction) => handleMove(direction)}
 *   onRemove={() => handleRemove()}
 * />
 */
export const ConditionActions: React.FC<ConditionActionsProps> = ({ 
  index, 
  onMove, 
  onRemove 
}) => (
  <div className="condition-actions">
    {/* Move Up button - disabled for first condition */}
    <button 
      className="icon-button"
      onClick={() => onMove('up')}
      disabled={index === 0}
      title="Move Up"
    >↑</button>

    {/* Move Down button */}
    <button 
      className="icon-button"
      onClick={() => onMove('down')}
      title="Move Down"
    >↓</button>

    {/* Remove condition button */}
    <button 
      className="icon-button remove"
      onClick={onRemove}
      title="Remove"
    >×</button>
  </div>
); 