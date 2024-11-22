import { useMemo, useState, useCallback } from 'react';
import type { SimpleCondition, NotCondition } from '../../../types/policy';

/**
 * Return type interface for the useCondition hook
 * @property isNot - Boolean indicating if the condition is negated
 * @property simpleCondition - The current simple condition object
 * @property operator - The current operator being used
 * @property value - The current value for the condition
 * @property error - Any error that occurred during condition operations
 * @property isLoading - Loading state during async operations
 * @property handleOperatorChange - Function to update the operator
 * @property handleNotToggle - Function to toggle condition negation
 * @property handleFieldChange - Function to update the condition field
 * @property handleValueChange - Function to update the condition value
 * @property clearError - Function to clear any existing errors
 */
interface UseConditionReturn {
  isNot: boolean;
  simpleCondition: SimpleCondition;
  operator: string;
  value: string;
  error: Error | null;
  isLoading: boolean;
  handleOperatorChange: (newOperator: string) => void;
  handleNotToggle: (checked: boolean) => void;
  handleFieldChange: (newField: string) => void;
  handleValueChange: (newValue: string) => void;
  clearError: () => void;
}

/**
 * Custom hook for managing condition state and operations
 * 
 * This hook provides a comprehensive way to manage condition logic including:
 * - Handling NOT operations
 * - Managing operators and values
 * - Error handling
 * - Loading states
 * - Safe updates with error boundaries
 * 
 * @param condition - The current condition object (either SimpleCondition or NotCondition)
 * @param onUpdate - Callback function to handle condition updates
 * @returns UseConditionReturn object with condition state and handlers
 * 
 * @example
 * const {
 *   isNot,
 *   operator,
 *   value,
 *   handleOperatorChange,
 *   handleNotToggle
 * } = useCondition(currentCondition, updateCondition);
 */
export const useCondition = (
  condition: SimpleCondition | NotCondition,
  onUpdate: (condition: SimpleCondition | NotCondition) => void
): UseConditionReturn => {
  // State management for errors and loading
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles errors that occur during condition operations
   */
  const handleError = useCallback((operation: string, error: Error) => {
    console.error(`Error in ${operation}:`, error);
    setError(error);
  }, []);

  /**
   * Clears any existing errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Safely executes update operations with error handling
   */
  const safeUpdate = useCallback(async (operation: string, updateFn: () => void) => {
    try {
      setIsLoading(true);
      clearError();
      await updateFn();
    } catch (err) {
      handleError(operation, err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  // Determine if condition is negated and extract simple condition
  const isNot = 'not' in condition;
  const simpleCondition: SimpleCondition = isNot 
    ? (condition as NotCondition).not as SimpleCondition 
    : condition as SimpleCondition;
  
  // Extract operator from condition
  const operator = useMemo(() => 
    Object.keys(simpleCondition).find(key => key !== 'field') || 'equals',
    [simpleCondition]
  );
  
  const value = useMemo(() => {
    const currentValue = simpleCondition[operator];
    if ((operator === 'in' || operator === 'notIn') && Array.isArray(currentValue)) {
      return JSON.stringify(currentValue);
    }
    return currentValue;
  }, [simpleCondition, operator]);

  /**
   * Handles changes to the condition operator
   */
  const handleOperatorChange = useCallback((newOperator: string) => {
    safeUpdate('operator change', () => {
      const { [operator]: oldValue, ...rest } = simpleCondition;
      const newCondition: SimpleCondition = { ...rest, field: simpleCondition.field, [newOperator]: oldValue };
      onUpdate(isNot ? { not: newCondition } : newCondition);
    });
  }, [operator, simpleCondition, isNot, onUpdate, safeUpdate]);

  /**
   * Handles toggling the NOT operator
   */
  const handleNotToggle = useCallback((checked: boolean) => {
    safeUpdate('NOT toggle', () => {
      if (checked) {
        onUpdate({ not: simpleCondition });
      } else {
        onUpdate(simpleCondition);
      }
    });
  }, [simpleCondition, onUpdate, safeUpdate]);

  /**
   * Handles changes to the condition field
   */
  const handleFieldChange = useCallback((newField: string) => {
    safeUpdate('field change', () => {
      const newCondition: SimpleCondition = { ...simpleCondition, field: newField };
      onUpdate(isNot ? { not: newCondition } : newCondition);
    });
  }, [simpleCondition, isNot, onUpdate, safeUpdate]);

  /**
   * Handles changes to the condition value
   */
  const handleValueChange = useCallback((newValue: string) => {
    safeUpdate('value change', () => {
      let processedValue: string | string[];
      
      // Process array values for 'in' and 'notIn' operators
      if (operator === 'in' || operator === 'notIn') {
        try {
          // Try to parse as JSON array first
          processedValue = JSON.parse(newValue);
          if (!Array.isArray(processedValue)) {
            // If valid JSON but not array, treat as regular string
            processedValue = newValue;
          }
        } catch {
          // If not valid JSON, treat as regular string
          processedValue = newValue;
        }
      } else {
        processedValue = newValue;
      }

      const newCondition: SimpleCondition = { 
        ...simpleCondition, 
        [operator]: processedValue 
      };
      
      onUpdate(isNot ? { not: newCondition } : newCondition);
    });
  }, [simpleCondition, operator, isNot, onUpdate, safeUpdate]);

  return {
    isNot,
    simpleCondition,
    operator,
    value,
    error,
    isLoading,
    handleOperatorChange,
    handleNotToggle,
    handleFieldChange,
    handleValueChange,
    clearError
  };
}; 