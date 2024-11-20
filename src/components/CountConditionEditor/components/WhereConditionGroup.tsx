import React from 'react';
import { ConditionGroup } from '../../ConditionGroup';
import { CountCondition } from '../../../types/policy';
import { useWhereCondition } from '../hooks/useWhereCondition';

/**
 * Props interface for the WhereConditionGroup component
 * @property condition - The count condition containing the where clause
 * @property onUpdate - Callback function to handle condition updates
 */
interface WhereConditionGroupProps {
  condition: CountCondition;
  onUpdate: (condition: CountCondition) => void;
}

/**
 * WhereConditionGroup component for managing count condition filters
 * 
 * This component renders the "where" clause of a count condition, allowing users
 * to define filters that determine which items should be counted. It provides
 * a complete condition group interface specifically for count condition filtering.
 * 
 * The component uses the ConditionGroup component to provide the same powerful
 * condition editing capabilities as the main condition editor, but specifically
 * for the "where" clause of count conditions.
 * 
 * @example
 * <WhereConditionGroup
 *   condition={countCondition}
 *   onUpdate={handleCountConditionUpdate}
 * />
 */
export const WhereConditionGroup: React.FC<WhereConditionGroupProps> = ({
  condition,
  onUpdate
}) => {
  // Initialize where condition state and handlers
  const {
    whereType,        // Current type of where clause (allOf/anyOf)
    whereConditions,  // Array of conditions in the where clause
    isWhereNot,      // Boolean flag for NOT operator
    handleWhereConditionsUpdate,  // Handler for condition updates
    handleToggleWhereType,        // Handler for toggling between allOf/anyOf
    handleToggleWhereNot          // Handler for toggling NOT operator
  } = useWhereCondition(condition, onUpdate);

  return (
    <div className="where-row">
      <div className="condition-content">
        <div className="condition-fields">
          {/* Label for the where clause */}
          <span className="where-text">where</span>
          
          {/* Condition group for where clause filters */}
          <ConditionGroup
            conditions={whereConditions}
            type={whereType}
            path={[]}  // Empty path as this is the root of the where clause
            isNot={isWhereNot}
            onUpdate={handleWhereConditionsUpdate}
            onToggleType={handleToggleWhereType}
            onToggleNot={handleToggleWhereNot}
          />
        </div>
      </div>
    </div>
  );
}; 