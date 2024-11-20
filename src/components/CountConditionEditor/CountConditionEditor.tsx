/**
 * CountConditionEditor Component
 * 
 * This component provides a specialized interface for editing count-based conditions
 * in Azure Policies. It allows users to:
 * 1. Count resources matching specific criteria
 * 2. Apply numeric comparisons (greater than, less than, equals)
 * 3. Create nested conditions for filtering counted resources
 * 4. Toggle NOT operators at multiple levels
 * 
 * Features:
 * - Searchable field selection for counting
 * - Nested condition groups for filtering
 * - Support for NOT operations at count and where levels
 * - Infinite scrolling for large field lists
 * 
 * @example
 * ```tsx
 * <CountConditionEditor
 *   condition={{
 *     count: { field: "virtualMachines", where: { anyOf: [] } },
 *     greater: 5
 *   }}
 *   onUpdate={(condition) => handleUpdate(condition)}
 * />
 * ```
 */

import React from 'react';
import { CountCondition } from '../../types/policy';
import { NotToggle } from '../ConditionEditor/components/NotToggle';
import { CountFieldSelect } from './components/CountFieldSelect';
import { CountOperatorSelect } from './components/CountOperatorSelect';
import { useCountCondition } from './hooks/useCountCondition';
import { WhereConditionGroup } from './components/WhereConditionGroup';
import '../../styles/PolicyEditor.css';

/**
 * Props for the CountConditionEditor component
 * @property condition - The count condition being edited
 * @property onUpdate - Callback for condition updates
 * @property onRemove - Optional callback for removing the condition
 */
interface CountConditionEditorProps {
  condition: CountCondition;
  onUpdate: (condition: CountCondition) => void;
  onRemove?: () => void;
}

/**
 * CountConditionEditor Component
 * 
 * Provides a complete interface for editing count-based conditions, including:
 * - Field selection for specifying what to count
 * - Operator selection for comparison (greater, less, equals)
 * - Numeric value input
 * - Where clause for filtering counted items
 * - NOT operation support at both count and where levels
 */
export const CountConditionEditor: React.FC<CountConditionEditorProps> = ({
  condition,
  onUpdate,
  onRemove
}) => {
  // Initialize count condition state and handlers
  const {
    isCountNot,          // Flag indicating if the count condition is negated
    currentOperator,     // Current comparison operator (greater, less, equals)
    currentValue,        // Current numeric value for comparison
    countField,          // Field being counted
    handleFieldChange,   // Handler for field changes
    handleOperatorChange,// Handler for operator changes
    handleValueChange,   // Handler for value changes
    handleToggleCountNot // Handler for toggling NOT operation
  } = useCountCondition(condition, onUpdate);

  return (
    <div className="count-condition-wrapper">
      <div className="condition-container">
        {/* Main condition row with count configuration */}
        <div className="condition-row">
          <div className="condition-content">
            <div className="condition-editor">
              <div className="condition-fields">
                {/* NOT operator toggle */}
                <NotToggle
                  checked={isCountNot}
                  onChange={handleToggleCountNot}
                />

                {/* Count type indicator */}
                <div className="condition-type-indicator count">C</div>

                {/* Field selection for counting */}
                <CountFieldSelect
                  value={countField}
                  onChange={handleFieldChange}
                />

                {/* Operator selection */}
                <CountOperatorSelect
                  value={currentOperator}
                  onChange={handleOperatorChange}
                />

                {/* Numeric value input */}
                <input
                  className="count-value-input"
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Where clause for filtering counted items */}
        <WhereConditionGroup
          condition={condition}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};

export default CountConditionEditor;
