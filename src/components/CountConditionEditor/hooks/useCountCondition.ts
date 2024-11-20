import { useState, useCallback } from 'react';
import { CountCondition, Condition } from '../../../types/policy';

/**
 * Type definition for a negated count condition
 * Represents the structure of a count condition wrapped in a NOT operator
 */
type NotCountCondition = {
  not: {
    count: {
      field: string;
      where: { allOf?: Condition[]; anyOf?: Condition[] };
    };
    [key: string]: any;
  };
};

/**
 * Custom hook for managing count condition state and operations
 * 
 * This hook provides comprehensive functionality for managing count conditions,
 * including handling NOT operations, operator changes, value updates, and field
 * selection. It handles both regular and negated count conditions seamlessly.
 * 
 * @param condition - The current count condition
 * @param onUpdate - Callback function to handle condition updates
 * 
 * @example
 * const {
 *   isCountNot,
 *   currentOperator,
 *   currentValue,
 *   countField,
 *   handleFieldChange,
 *   handleOperatorChange
 * } = useCountCondition(condition, updateCondition);
 */
export const useCountCondition = (
  condition: CountCondition,
  onUpdate: (condition: CountCondition) => void
) => {
  /**
   * Checks if the condition is negated (wrapped in NOT)
   */
  const isCountNot = () => 'not' in condition;

  /**
   * Gets the current operator from the condition
   * Handles both regular and negated conditions
   */
  const getCurrentOperator = () => {
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      return Object.keys(notCondition.not).find(key => key !== 'count') || 'greater';
    }
    return Object.keys(condition).find(key => key !== 'count') || 'greater';
  };

  /**
   * Gets the current value for the operator
   * Handles both regular and negated conditions
   */
  const getCurrentValue = () => {
    const operator = getCurrentOperator();
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      return notCondition.not[operator];
    }
    return (condition as any)[operator];
  };

  /**
   * Gets the current count field
   * Handles both regular and negated conditions
   */
  const getCountField = () => {
    if (isCountNot()) {
      return (condition as unknown as NotCountCondition).not.count.field;
    }
    return condition.count.field;
  };

  /**
   * Handles changes to the count field
   * Updates the field while preserving other condition properties
   */
  const handleFieldChange = useCallback((field: string) => {
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          ...notCondition.not,
          count: {
            ...notCondition.not.count,
            field,
          }
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        ...condition,
        count: {
          ...condition.count,
          field,
        },
      });
    }
  }, [condition, onUpdate]);

  /**
   * Handles changes to the operator
   * Preserves the current value while changing the operator type
   */
  const handleOperatorChange = useCallback((newOperator: string) => {
    const currentValue = getCurrentValue();
    
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          count: notCondition.not.count,
          [newOperator]: currentValue
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        count: condition.count,
        [newOperator]: currentValue
      });
    }
  }, [condition, onUpdate]);

  /**
   * Handles changes to the count value
   * Automatically converts numeric strings to numbers
   */
  const handleValueChange = useCallback((value: string) => {
    const operator = getCurrentOperator();
    const isNumber = !isNaN(Number(value)) && value !== '';
    const processedValue = isNumber ? Number(value) : value;
    
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          count: notCondition.not.count,
          [operator]: processedValue
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        count: condition.count,
        [operator]: processedValue
      });
    }
  }, [condition, onUpdate]);

  /**
   * Toggles the NOT operator for the entire count condition
   * Preserves all other condition properties
   */
  const handleToggleCountNot = useCallback(() => {
    const operator = getCurrentOperator();
    const currentValue = getCurrentValue();
    
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      const baseCondition = {
        count: notCondition.not.count,
        [operator]: notCondition.not[operator]
      };
      onUpdate(baseCondition as CountCondition);
    } else {
      const baseCondition = {
        count: condition.count,
        [operator]: currentValue
      };
      onUpdate({ not: baseCondition } as unknown as CountCondition);
    }
  }, [condition, onUpdate]);

  return {
    isCountNot: isCountNot(),
    currentOperator: getCurrentOperator(),
    currentValue: getCurrentValue(),
    countField: getCountField(),
    handleFieldChange,
    handleOperatorChange,
    handleValueChange,
    handleToggleCountNot
  };
}; 