import React, { useRef, useState } from 'react';
import { OperationsListProps, Operation } from '../types';
import modAliases from '../../../data/modAlias.json';

/**
 * Array of available operation types for policy modifications
 */
const AVAILABLE_OPERATIONS = ['addOrReplace', 'add', 'remove'] as const;

/**
 * OperationsList component for managing policy modification operations
 * 
 * This component provides an interface for defining and managing operations
 * that modify Azure resources. It supports:
 * - Adding/removing operations
 * - Selecting operation types
 * - Specifying fields with searchable dropdown
 * - Setting operation values
 * - Conditional operation configuration
 * 
 * @example
 * <OperationsList
 *   operations={currentOperations}
 *   onUpdateOperations={handleOperationsUpdate}
 * />
 */
export const OperationsList: React.FC<OperationsListProps> = ({
  operations,
  onUpdateOperations
}) => {
  // State for managing field search functionality
  const [fieldSearchTerms, setFieldSearchTerms] = useState<{ [key: number]: string }>({});
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState<{ [key: number]: boolean }>({});
  const [fieldDropdownPositions, setFieldDropdownPositions] = useState<{ [key: number]: { top: number, left: number } }>({});
  
  // Refs for dropdown positioning
  const fieldDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const fieldInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  /**
   * Adds a new operation to the list
   */
  const handleAddOperation = () => {
    onUpdateOperations([...operations, { operation: '', field: '', value: '' }]);
  };

  /**
   * Removes an operation from the list
   * @param index - Index of the operation to remove
   */
  const handleRemoveOperation = (index: number) => {
    onUpdateOperations(operations.filter((_, i) => i !== index));
  };

  /**
   * Updates a specific field of an operation
   * @param index - Index of the operation to update
   * @param field - Field to update (operation, field, value, condition)
   * @param value - New value for the field
   */
  const handleOperationChange = (index: number, field: keyof Operation, value: string) => {
    const newOperations = operations.map((op, i) => {
      if (i === index) {
        if (field === 'condition' && !value.trim()) {
          const { condition, ...restOp } = { ...op };
          return restOp;
        }
        return { ...op, [field]: value };
      }
      return op;
    });
    onUpdateOperations(newOperations);
  };

  /**
   * Updates the position of a field dropdown
   * @param index - Index of the operation whose dropdown position needs updating
   */
  const updateFieldDropdownPosition = (index: number) => {
    if (fieldInputRefs.current[index]) {
      const rect = fieldInputRefs.current[index]!.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= 300 ? rect.bottom + window.scrollY : rect.top - 300 + window.scrollY;
      setFieldDropdownPositions(prev => ({
        ...prev,
        [index]: {
          top,
          left: rect.left + window.scrollX
        }
      }));
    }
  };

  return (
    <div className="form-group">
      <label>Operations</label>
      {operations.map((operation, index) => (
        <div key={index} className="operation-item">
          {/* Operation header with remove button */}
          <div className="operation-header">
            <h4>Operation {index + 1}</h4>
            <button
              className="remove-operation"
              onClick={() => handleRemoveOperation(index)}
            >×</button>
          </div>
          
          {/* Operation fields */}
          <div className="operation-fields">
            {/* Condition input */}
            <input
              type="text"
              value={operation.condition}
              onChange={(e) => handleOperationChange(index, 'condition', e.target.value)}
              placeholder="Condition"
            />
            
            {/* Operation type select */}
            <select
              value={operation.operation}
              onChange={(e) => handleOperationChange(index, 'operation', e.target.value)}
            >
              <option value="">Select Operation</option>
              {AVAILABLE_OPERATIONS.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            {/* Field selection with searchable dropdown */}
            <div className="searchable-dropdown" ref={el => fieldDropdownRefs.current[index] = el}>
              <input
                ref={el => fieldInputRefs.current[index] = el}
                type="text"
                value={isFieldDropdownOpen[index] ? (fieldSearchTerms[index] || '') : operation.field}
                onChange={(e) => {
                  if (isFieldDropdownOpen[index]) {
                    setFieldSearchTerms(prev => ({ ...prev, [index]: e.target.value }));
                  } else {
                    handleOperationChange(index, 'field', e.target.value);
                  }
                }}
                onClick={() => {
                  setIsFieldDropdownOpen(prev => ({
                    ...prev,
                    [index]: !prev[index]
                  }));
                  updateFieldDropdownPosition(index);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsFieldDropdownOpen(prev => ({ ...prev, [index]: false }));
                    if (fieldSearchTerms[index]) {
                      handleOperationChange(index, 'field', fieldSearchTerms[index]);
                    }
                  }, 200);
                }}
                placeholder="Search fields or enter custom value..."
                className="field-search-input"
                style={{ width: '100%', height: '32px' }}
              />
              
              {/* Field options dropdown */}
              {isFieldDropdownOpen[index] && (
                <div 
                  className="field-options"
                  style={{
                    position: 'fixed',
                    top: `${fieldDropdownPositions[index]?.top || 0}px`,
                    left: `${fieldDropdownPositions[index]?.left || 0}px`,
                    width: fieldInputRefs.current[index]?.offsetWidth,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  {modAliases
                    .filter(field => 
                      field.toLowerCase().includes((fieldSearchTerms[index] || '').toLowerCase())
                    )
                    .map((field) => (
                      <div
                        key={field}
                        className="field-option"
                        onClick={() => {
                          const valueWithoutParens = field.split(' (')[0];
                          handleOperationChange(index, 'field', valueWithoutParens);
                          setIsFieldDropdownOpen(prev => ({ ...prev, [index]: false }));
                          setFieldSearchTerms(prev => ({ ...prev, [index]: '' }));
                        }}
                      >
                        {field}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Value input */}
            <input
              type="text"
              value={operation.value}
              onChange={(e) => handleOperationChange(index, 'value', e.target.value)}
              placeholder="Value"
            />
          </div>
        </div>
      ))}
      
      {/* Add operation button */}
      <button className="add-operation-button" onClick={handleAddOperation}>
        Add Operation
      </button>
    </div>
  );
}; 