import { Condition, SimpleCondition, NestedCondition, CountCondition, NotCondition } from '../../../types/policy';

/**
 * Props interface for the ConditionGroup component
 * @property conditions - Array of conditions in the group
 * @property type - Type of logical grouping ('allOf' or 'anyOf')
 * @property path - Array of indices representing the group's position in the condition tree
 * @property index - Optional index of this group within its parent
 * @property isNot - Optional flag indicating if the group is negated
 * @property onUpdate - Callback for updating conditions in the group
 * @property onToggleType - Optional callback for toggling between allOf/anyOf
 * @property onMove - Optional callback for moving the group up/down
 * @property onRemove - Optional callback for removing the group
 * @property onToggleNot - Optional callback for toggling NOT operator
 */
export interface ConditionGroupProps {
  conditions: Condition[];
  type: 'allOf' | 'anyOf';
  path: number[];
  index?: number;
  isNot?: boolean;
  onUpdate: (conditions: Condition[]) => void;
  onToggleType?: () => void;
  onMove?: (direction: 'up' | 'down') => void;
  onRemove?: () => void;
  onToggleNot?: () => void;
}

/**
 * Props interface for the ConditionItem component
 * @property condition - The condition to render
 * @property index - Index of the condition in its group
 * @property path - Array of indices representing the condition's position in the tree
 * @property onUpdate - Callback for updating the condition
 * @property onMove - Callback for moving the condition up/down
 * @property onRemove - Callback for removing the condition
 * @property onToggleType - Callback for toggling condition type
 */
export interface ConditionItemProps {
  condition: Condition;
  index: number;
  path: number[];
  onUpdate: (condition: Condition) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
  onToggleType: () => void;
}

/**
 * Props interface for the ConditionActions component
 * @property index - Index of the condition in its group
 * @property onMove - Callback for moving the condition up/down
 * @property onRemove - Callback for removing the condition
 */
export interface ConditionActionsProps {
  index: number;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

/**
 * Type for movement direction
 * Used in move operations for conditions and groups
 */
export type Direction = 'up' | 'down';

/**
 * Type guard for identifying simple conditions
 * Checks if the condition has a field property and is not a count condition,
 * or if it's a negated simple condition
 * 
 * @param condition - Condition to check
 * @returns boolean indicating if the condition is a simple condition
 */
export const isSimpleCondition = (condition: Condition): condition is SimpleCondition | NotCondition => 
  ('field' in condition && !('count' in condition)) || 
  ('not' in condition && 'field' in (condition as NotCondition).not);

/**
 * Type guard for identifying count conditions
 * Checks if the condition has a count property,
 * or if it's a negated count condition
 * 
 * @param condition - Condition to check
 * @returns boolean indicating if the condition is a count condition
 */
export const isCountCondition = (condition: Condition): condition is CountCondition => 
  'count' in condition || ('not' in condition && 'count' in (condition as any).not);

/**
 * Type guard for identifying nested conditions
 * Checks if the condition is a group (allOf/anyOf) and not a count condition,
 * or if it's a negated group condition
 * 
 * @param condition - Condition to check
 * @returns boolean indicating if the condition is a nested condition
 */
export const isNestedCondition = (condition: Condition): condition is NestedCondition => {
  if ('not' in condition) {
    const notCondition = condition.not as NestedCondition;
    return 'allOf' in notCondition || 'anyOf' in notCondition;
  }
  return ('allOf' in condition || 'anyOf' in condition) && !('count' in condition);
}; 