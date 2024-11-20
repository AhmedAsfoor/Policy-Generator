import { useState, useCallback } from 'react';
import { Condition, NestedCondition } from '../../../types/policy';
import { Direction, isNestedCondition } from '../types';

/**
 * Custom hook for managing condition group state and operations
 * 
 * This hook provides comprehensive functionality for managing groups of conditions including:
 * - Adding different types of conditions (simple, nested, count)
 * - Updating existing conditions
 * - Moving conditions within the group
 * - Removing conditions
 * - Managing group collapse state
 * - Toggling group types (allOf/anyOf)
 * 
 * @param conditions - Array of conditions in the group
 * @param isNot - Boolean flag indicating if the group is negated
 * @param onUpdate - Callback function to handle condition updates
 * 
 * @example
 * const {
 *   handleAddCondition,
 *   handleRemoveCondition,
 *   handleMoveCondition,
 *   handleToggleGroupType
 * } = useConditionGroup(conditions, isNot, updateConditions);
 */
export const useConditionGroup = (
  conditions: Condition[],
  isNot: boolean | undefined,
  onUpdate: (conditions: Condition[]) => void
) => {
  // State for tracking collapsed state of nested groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  /**
   * Adds a new simple condition to the beginning of the group
   */
  const handleAddCondition = useCallback(() => {
    onUpdate([{ field: '', equals: '' }, ...conditions]);
  }, [conditions, onUpdate]);

  /**
   * Adds a new nested condition group
   * Creates an empty anyOf group, respecting the current NOT state
   */
  const handleAddNestedGroup = useCallback(() => {
    const newGroup = { anyOf: [] };
    onUpdate([...conditions, isNot ? { not: newGroup } : newGroup]);
  }, [conditions, isNot, onUpdate]);

  /**
   * Adds a new count condition to the beginning of the group
   * Creates a count condition with default values and an empty where clause
   */
  const handleAddCountCondition = useCallback(() => {
    onUpdate([{
      count: {
        field: "",
        where: { anyOf: [] }
      },
      greater: 0
    }, ...conditions]);
  }, [conditions, onUpdate]);

  /**
   * Updates a specific condition in the group
   * @param idx - Index of the condition to update
   * @param updated - New condition value
   */
  const handleUpdateCondition = useCallback((idx: number, updated: Condition) => {
    const newConditions = [...conditions];
    newConditions[idx] = updated;
    onUpdate(newConditions);
  }, [conditions, onUpdate]);

  /**
   * Removes a condition from the group
   * If it's the last condition, replaces it with an empty condition
   * @param idx - Index of the condition to remove
   */
  const handleRemoveCondition = useCallback((idx: number) => {
    if (conditions.length === 1) {
      onUpdate([{ field: '', equals: '' }]);
    } else {
      onUpdate(conditions.filter((_, i) => i !== idx));
    }
  }, [conditions, onUpdate]);

  /**
   * Moves a condition up or down within the group
   * @param idx - Index of the condition to move
   * @param direction - Direction to move ('up' or 'down')
   */
  const handleMoveCondition = useCallback((idx: number, direction: Direction) => {
    if ((direction === 'up' && idx === 0) || 
        (direction === 'down' && idx === conditions.length - 1)) return;

    const newConditions = [...conditions];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newConditions[idx], newConditions[targetIdx]] = [newConditions[targetIdx], newConditions[idx]];
    onUpdate(newConditions);
  }, [conditions, onUpdate]);

  /**
   * Toggles a nested group's type between allOf and anyOf
   * @param idx - Index of the nested group to toggle
   */
  const handleToggleGroupType = useCallback((idx: number) => {
    const condition = conditions[idx];
    if (!isNestedCondition(condition)) return;

    const isConditionNot = 'not' in condition;
    const groupCondition = isConditionNot ? condition.not as NestedCondition : condition;
    const currentConditions = groupCondition.allOf || groupCondition.anyOf || [];
    const newType = groupCondition.allOf ? 'anyOf' : 'allOf';
    
    const newGroup = { [newType]: currentConditions };
    const newConditions = [...conditions];
    newConditions[idx] = isConditionNot ? { not: newGroup } : newGroup;
    
    onUpdate(newConditions);
  }, [conditions, onUpdate]);

  /**
   * Toggles the collapsed state of a nested group
   * @param groupKey - Unique identifier for the group
   */
  const toggleCollapse = useCallback((groupKey: string) => {
    setCollapsedGroups(prev => ({ 
      ...prev, 
      [groupKey]: !prev[groupKey] 
    }));
  }, []);

  return {
    collapsedGroups,
    handleAddCondition,
    handleAddNestedGroup,
    handleAddCountCondition,
    handleUpdateCondition,
    handleRemoveCondition,
    handleMoveCondition,
    handleToggleGroupType,
    toggleCollapse
  };
}; 