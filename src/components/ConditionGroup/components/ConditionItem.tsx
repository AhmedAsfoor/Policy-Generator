import React from 'react';
import { ConditionItemProps, isSimpleCondition, isCountCondition, isNestedCondition } from '../types';
import ConditionEditor from '../../ConditionEditor';
import { CountConditionEditor } from '../../CountConditionEditor/CountConditionEditor';
import type { Condition, NestedCondition } from '../../../types/policy';
import { ConditionActions } from './ConditionActions';
import type { ConditionGroupProps } from '../types';

/**
 * Lazy load ConditionGroup to avoid circular dependency
 * This is necessary because ConditionGroup and ConditionItem reference each other
 */
const ConditionGroup = React.lazy(() => import('../ConditionGroup').then(m => ({ 
  default: m.ConditionGroup 
})));

/**
 * ConditionItem component for rendering different types of conditions
 * 
 * This component acts as a dispatcher that renders the appropriate editor
 * based on the condition type:
 * - Simple conditions (field/operator/value)
 * - Count conditions (count-based rules)
 * - Nested conditions (groups of conditions with AND/OR logic)
 * 
 * Each condition type gets its own specialized editor while maintaining
 * consistent action buttons for moving and removing conditions.
 * 
 * @example
 * <ConditionItem
 *   condition={condition}
 *   index={0}
 *   path={[0]}
 *   onUpdate={handleUpdate}
 *   onMove={handleMove}
 *   onRemove={handleRemove}
 *   onToggleType={handleToggleType}
 * />
 */
export const ConditionItem: React.FC<ConditionItemProps> = ({
  condition,
  index,
  path,
  onUpdate,
  onMove,
  onRemove,
  onToggleType
}) => {
  /**
   * Render simple condition with field/operator/value
   */
  if (isSimpleCondition(condition)) {
    return (
      <div className="condition-container">
        <div className="condition-row">
          <ConditionEditor condition={condition} onUpdate={onUpdate} />
          <ConditionActions index={index} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>
    );
  }

  /**
   * Render count-based condition
   */
  if (isCountCondition(condition)) {
    return (
      <div className="condition-container">
        <div className="condition-row">
          <CountConditionEditor 
            condition={condition} 
            onUpdate={onUpdate} 
            onRemove={onRemove} 
          />
          <ConditionActions index={index} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>
    );
  }

  /**
   * Render nested condition group (allOf/anyOf)
   * Handles both regular and negated (NOT) nested conditions
   */
  if (isNestedCondition(condition)) {
    const isNot = 'not' in condition;
    const groupCondition = isNot ? (condition.not as NestedCondition) : condition;
    const groupType = 'allOf' in groupCondition ? 'allOf' : 'anyOf';
    const conditions = groupCondition[groupType] || [];

    return (
      <div className="nested-group-container">
        <React.Suspense fallback={<div>Loading...</div>}>
          <ConditionGroup
            conditions={conditions}
            type={groupType}
            path={[...path, index]}
            index={index}
            isNot={isNot}
            onUpdate={(updatedConditions: Condition[]) => {
              const newGroup = { [groupType]: updatedConditions };
              onUpdate(isNot ? { not: newGroup } : newGroup);
            }}
            onMove={onMove}
            onRemove={onRemove}
            onToggleType={onToggleType}
            onToggleNot={() => {
              const newGroup = { [groupType]: conditions };
              onUpdate(isNot ? newGroup : { not: newGroup });
            }}
          />
        </React.Suspense>
      </div>
    );
  }

  // Return null if condition type is not recognized
  return null;
}; 