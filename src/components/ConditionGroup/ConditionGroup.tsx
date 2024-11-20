import React from 'react';
import { ConditionGroupProps } from './types';
import { useConditionGroup } from './hooks/useConditionGroup';
import { ConditionItem } from './components/ConditionItem';
import { GroupHeader } from './components/GroupHeader';

/**
 * ConditionGroup component for managing groups of conditions
 * 
 * This component provides a complete interface for managing condition groups, including:
 * - Displaying and managing nested condition hierarchies
 * - Handling allOf/anyOf logic groups
 * - Supporting NOT operations on groups
 * - Managing condition ordering and removal
 * - Supporting collapsible groups
 * - Handling nested group visualization
 * 
 * @example
 * <ConditionGroup
 *   conditions={conditions}
 *   type="allOf"
 *   path={[0]}
 *   isNot={false}
 *   onUpdate={handleUpdate}
 *   onToggleType={handleToggleType}
 * />
 */
export const ConditionGroup: React.FC<ConditionGroupProps> = ({ 
  conditions,
  type,
  path,
  index,
  isNot,
  onUpdate,
  onToggleType,
  onMove,
  onRemove,
  onToggleNot
}) => {
  // Generate unique key for the group based on its path
  const groupKey = path.join('-');

  // Initialize group state and handlers
  const {
    collapsedGroups,
    handleAddCondition,
    handleAddNestedGroup,
    handleAddCountCondition,
    handleUpdateCondition,
    handleRemoveCondition,
    handleMoveCondition,
    handleToggleGroupType,
    toggleCollapse
  } = useConditionGroup(conditions, isNot, onUpdate);

  return (
    <div className="condition-group">
      {/* Render visual indicator for nested groups */}
      {path.length > 0 && (
        <div className="nested-line" data-level={path.length} />
      )}
      
      {/* Group header with controls */}
      <GroupHeader
        isNot={isNot}
        onToggleNot={onToggleNot}
        isCollapsed={collapsedGroups[groupKey]}
        onToggleCollapse={() => toggleCollapse(groupKey)}
        type={type}
        onToggleType={onToggleType}
        onAddCondition={handleAddCondition}
        onAddNestedGroup={handleAddNestedGroup}
        onAddCountCondition={handleAddCountCondition}
        onClearAll={path.length === 0 ? () => onUpdate([]) : undefined}
        showClearAll={path.length === 0}
        showMoveActions={path.length > 0}
        onMove={onMove}
        onRemove={onRemove}
        index={index}
      />
      
      {/* Render conditions list when group is not collapsed */}
      {!collapsedGroups[groupKey] && (
        <div className="conditions-list">
          {conditions.map((condition, idx) => (
            <ConditionItem
              key={idx}
              condition={condition}
              index={idx}
              path={path}
              onUpdate={(updated) => handleUpdateCondition(idx, updated)}
              onMove={(direction) => handleMoveCondition(idx, direction)}
              onRemove={() => handleRemoveCondition(idx)}
              onToggleType={() => handleToggleGroupType(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add default export for lazy loading
export default ConditionGroup; 