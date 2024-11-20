import { useCallback } from 'react';
import { CountCondition, Condition } from '../../../types/policy';

/**
 * Base type for where conditions
 * Can contain either allOf or anyOf arrays of conditions
 */
type WhereConditionBase = {
  allOf?: Condition[];
  anyOf?: Condition[];
};

/**
 * Type for where conditions that can be either simple or negated
 */
type WhereCondition = 
  | WhereConditionBase
  | { not: WhereConditionBase };

/**
 * Type for negated count conditions
 * Represents the structure when a count condition is wrapped in NOT
 */
type NotCountCondition = {
  not: {
    count: {
      field: string;
      where: WhereCondition;
    };
    [key: string]: any;
  };
};

/**
 * Custom hook for managing where clause state in count conditions
 * 
 * This hook provides comprehensive functionality for managing where clauses,
 * including handling nested NOT operations, allOf/anyOf logic, and condition
 * updates while maintaining proper structure.
 * 
 * @param condition - The count condition containing the where clause
 * @param onUpdate - Callback function to handle condition updates
 * 
 * @example
 * const {
 *   whereType,
 *   whereConditions,
 *   isWhereNot,
 *   handleWhereConditionsUpdate,
 *   handleToggleWhereType
 * } = useWhereCondition(condition, updateCondition);
 */
export const useWhereCondition = (
  condition: CountCondition,
  onUpdate: (condition: CountCondition) => void
) => {
  /**
   * Checks if the count condition is negated
   */
  const isCountNot = () => 'not' in condition;

  /**
   * Checks if the where clause is negated
   * Handles both regular and negated count conditions
   */
  const isWhereNot = () => {
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      return 'not' in notCondition.not.count.where;
    }
    return 'not' in condition.count.where;
  };

  /**
   * Gets the current where clause type (allOf/anyOf)
   * Handles both regular and negated conditions
   */
  const getWhereType = (): 'allOf' | 'anyOf' => {
    const countCondition = isCountNot() 
      ? (condition as unknown as NotCountCondition).not.count
      : condition.count;

    const whereCondition = isWhereNot() 
      ? (countCondition.where as { not: WhereConditionBase }).not
      : countCondition.where as WhereConditionBase;
    
    return 'allOf' in whereCondition ? 'allOf' : 'anyOf';
  };

  /**
   * Gets the current conditions from the where clause
   * Handles both regular and negated conditions
   */
  const getWhereConditions = (): Condition[] => {
    const type = getWhereType();
    const countCondition = isCountNot() 
      ? (condition as unknown as NotCountCondition).not.count
      : condition.count;

    const whereCondition = isWhereNot()
      ? (countCondition.where as { not: WhereConditionBase }).not
      : countCondition.where as WhereConditionBase;
    
    return whereCondition[type] || [];
  };

  /**
   * Handles updates to where clause conditions
   * Preserves NOT state and condition structure
   */
  const handleWhereConditionsUpdate = useCallback((conditions: Condition[]) => {
    const type = getWhereType();
    const newWhereCondition: WhereCondition = isWhereNot()
      ? { not: { [type]: conditions } as WhereConditionBase }
      : { [type]: conditions } as WhereConditionBase;
    
    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          ...notCondition.not,
          count: {
            ...notCondition.not.count,
            where: newWhereCondition
          }
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        ...condition,
        count: {
          ...condition.count,
          where: newWhereCondition as WhereConditionBase
        },
      });
    }
  }, [condition, onUpdate]);

  /**
   * Toggles between allOf and anyOf for the where clause
   * Preserves conditions and NOT state
   */
  const handleToggleWhereType = useCallback(() => {
    const currentType = getWhereType();
    const newType = currentType === 'allOf' ? 'anyOf' : 'allOf';
    const conditions = getWhereConditions();
    
    const newWhereCondition: WhereCondition = isWhereNot()
      ? { not: { [newType]: conditions } as WhereConditionBase }
      : { [newType]: conditions } as WhereConditionBase;

    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          ...notCondition.not,
          count: {
            ...notCondition.not.count,
            where: newWhereCondition
          }
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        ...condition,
        count: {
          ...condition.count,
          where: newWhereCondition as WhereConditionBase
        },
      });
    }
  }, [condition, onUpdate]);

  /**
   * Toggles the NOT operator for the where clause
   * Preserves conditions and type
   */
  const handleToggleWhereNot = useCallback(() => {
    const type = getWhereType();
    const conditions = getWhereConditions();
    
    const newWhereCondition: WhereCondition = isWhereNot()
      ? { [type]: conditions } as WhereConditionBase
      : { not: { [type]: conditions } as WhereConditionBase };

    if (isCountNot()) {
      const notCondition = condition as unknown as NotCountCondition;
      onUpdate({
        not: {
          ...notCondition.not,
          count: {
            ...notCondition.not.count,
            where: newWhereCondition
          }
        }
      } as unknown as CountCondition);
    } else {
      onUpdate({
        ...condition,
        count: {
          ...condition.count,
          where: newWhereCondition as WhereConditionBase
        },
      });
    }
  }, [condition, onUpdate]);

  return {
    whereType: getWhereType(),
    whereConditions: getWhereConditions(),
    isWhereNot: isWhereNot(),
    handleWhereConditionsUpdate,
    handleToggleWhereType,
    handleToggleWhereNot
  };
}; 