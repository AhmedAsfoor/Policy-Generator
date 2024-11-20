import React from 'react';
import { Direction } from '../types';

/**
 * Props interface for the GroupHeader component
 * @property isNot - Boolean flag indicating if the group is negated
 * @property onToggleNot - Callback to toggle NOT operator for the group
 * @property isCollapsed - Boolean flag for group's collapsed state
 * @property onToggleCollapse - Callback to toggle group's collapsed state
 * @property type - Group type ('allOf' or 'anyOf')
 * @property onToggleType - Callback to toggle between allOf/anyOf
 * @property onAddCondition - Callback to add a new condition
 * @property onAddNestedGroup - Callback to add a nested condition group
 * @property onAddCountCondition - Callback to add a count-based condition
 * @property onClearAll - Optional callback to clear all conditions
 * @property showClearAll - Boolean flag to show/hide clear all button
 * @property showMoveActions - Boolean flag to show/hide move actions
 * @property onMove - Optional callback for moving the group
 * @property onRemove - Optional callback for removing the group
 * @property index - Optional index of the group in its parent
 */
interface GroupHeaderProps {
  isNot?: boolean;
  onToggleNot?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  type: 'allOf' | 'anyOf';
  onToggleType?: () => void;
  onAddCondition: () => void;
  onAddNestedGroup: () => void;
  onAddCountCondition: () => void;
  onClearAll?: () => void;
  showClearAll: boolean;
  showMoveActions: boolean;
  onMove?: (direction: Direction) => void;
  onRemove?: () => void;
  index?: number;
}

/**
 * GroupHeader component for managing condition groups
 * 
 * This component provides the header interface for condition groups, including:
 * - NOT operator toggle
 * - Collapse/expand functionality
 * - Group type toggle (allOf/anyOf)
 * - Buttons for adding different types of conditions
 * - Group movement and removal controls
 * 
 * @example
 * <GroupHeader
 *   isNot={false}
 *   isCollapsed={false}
 *   type="allOf"
 *   onToggleCollapse={() => setCollapsed(!collapsed)}
 *   onAddCondition={handleAddCondition}
 *   showClearAll={true}
 *   showMoveActions={true}
 * />
 */
export const GroupHeader: React.FC<GroupHeaderProps> = ({
  isNot,
  onToggleNot,
  isCollapsed,
  onToggleCollapse,
  type,
  onToggleType,
  onAddCondition,
  onAddNestedGroup,
  onAddCountCondition,
  onClearAll,
  showClearAll,
  showMoveActions,
  onMove,
  onRemove,
  index
}) => (
  <div className="group-header">
    {/* Group type controls */}
    <div className="group-type-container">
      {/* NOT operator toggle */}
      <label className="not-checkbox">
        <input
          type="checkbox"
          checked={isNot}
          onChange={onToggleNot}
          title="Toggle NOT operator"
          className="not-checkbox-input"
        />
        <span className="not-checkbox-label">NOT</span>
      </label>

      {/* Collapse/expand toggle */}
      <button
        className={`collapse-toggle ${isCollapsed ? 'collapsed' : ''}`}
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? '►' : '▼'}
      </button>

      {/* Group type display and toggle */}
      <span className="group-type-select">{type}</span>
      <button 
        className="group-type-toggle"
        onClick={onToggleType}
        title="Toggle between AllOf and AnyOf"
      >
        ⇄
      </button>
    </div>
    
    {/* Group action buttons */}
    <div className="group-controls">
      <button onClick={onAddCondition}>Add Condition</button>
      <button onClick={onAddNestedGroup}>Add Grouped Conditions</button>
      <button onClick={onAddCountCondition}>Add Count Condition</button>
      {showClearAll && (
        <button 
          className="clear-all-button"
          onClick={onClearAll}
          title="Clear All Conditions"
        >×</button>
      )}
    </div>

    {/* Move and remove actions */}
    {showMoveActions && onMove && onRemove && (
      <div className="condition-actions">
        <button 
          className="icon-button"
          onClick={() => onMove('up')}
          disabled={!index || index === 0}
          title="Move Up"
        >↑</button>
        <button 
          className="icon-button"
          onClick={() => onMove('down')}
          title="Move Down"
        >↓</button>
        <button 
          className="icon-button remove"
          onClick={onRemove}
          title="Remove"
        >×</button>
      </div>
    )}
  </div>
); 