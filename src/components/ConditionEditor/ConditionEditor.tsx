/**
 * ConditionEditor Component
 */

import React, { useRef } from 'react';
import { AVAILABLE_FIELDS, OPERATOR_PLACEHOLDERS } from '../../constants/policy';
import type { SimpleCondition, NotCondition } from '../../types/policy';
import resourceTypes from '../../data/azure_resource_types.json';
import { useDropdown } from './hooks/useDropdown';
import { useCondition } from './hooks/useCondition';
import { NotToggle } from './components/NotToggle';
import { OperatorSelect } from './components/OperatorSelect';
import { SearchableInput } from './components/SearchableInput';
import { Dropdown } from './components/Dropdown';

/**
 * Props interface for the ConditionEditor component
 * @property condition - The current condition object to edit
 * @property onUpdate - Callback function to handle condition updates
 */
interface ConditionEditorProps {
  condition: SimpleCondition | NotCondition;
  onUpdate: (condition: SimpleCondition | NotCondition) => void;
}

// Constants for pagination
const ITEMS_PER_PAGE = 50;
const VALUE_ITEMS_PER_PAGE = 50;

/**
 * ConditionEditor component for editing policy conditions
 * 
 * This component provides a complete interface for editing policy conditions, including:
 * - Field selection with search functionality
 * - Operator selection
 * - Value input with resource type suggestions
 * - NOT operator toggle
 * - Infinite scrolling for large lists
 * 
 * The component manages complex state through custom hooks and provides
 * a user-friendly interface for building policy conditions.
 * 
 * @example
 * <ConditionEditor
 *   condition={currentCondition}
 *   onUpdate={handleConditionUpdate}
 * />
 */
export const ConditionEditor: React.FC<ConditionEditorProps> = ({ condition, onUpdate }) => {
  // Refs for input elements
  const inputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize condition state management
  const conditionState = useCondition(condition, onUpdate);
  
  // Initialize dropdown state for field selection
  const fieldDropdown = useDropdown(
    inputRef, 
    ITEMS_PER_PAGE, 
    AVAILABLE_FIELDS.length,
    conditionState.simpleCondition.field
  );
  
  // Initialize dropdown state for value selection
  const valueDropdown = useDropdown(
    valueInputRef, 
    VALUE_ITEMS_PER_PAGE, 
    resourceTypes.length,
    conditionState.value
  );

  /**
   * Renders the value input field with appropriate dropdown content
   * Handles different behavior based on field type (resource type vs other fields)
   */
  const renderValueInput = () => {
    const isTypeField = conditionState.simpleCondition.field === 'type';
    
    return (
      <SearchableInput
        inputRef={valueInputRef}
        value={valueDropdown.currentValue}
        searchTerm={valueDropdown.searchTerm}
        isOpen={valueDropdown.isOpen}
        placeholder={isTypeField 
          ? "Search resource types or enter custom value..."
          : OPERATOR_PLACEHOLDERS[conditionState.operator as keyof typeof OPERATOR_PLACEHOLDERS]
        }
        onChange={(value) => {
          conditionState.handleValueChange(value);
          valueDropdown.setCurrentValue(value);
        }}
        onSearchChange={valueDropdown.setSearchTerm}
        onFocus={() => {
          if (isTypeField) {
            valueDropdown.handleInputFocus();
          }
        }}
        onBlur={() => valueDropdown.handleBlur((value) => {
          conditionState.handleValueChange(value);
          valueDropdown.setCurrentValue(value);
        })}
        dropdownContent={isTypeField ? (
          <Dropdown
            isOpen={valueDropdown.isOpen}
            position={valueDropdown.position}
            width={valueInputRef.current?.offsetWidth}
            onScroll={valueDropdown.handleScroll}
          >
            {resourceTypes
              .filter(type => type.toLowerCase().includes(valueDropdown.searchTerm.toLowerCase()))
              .slice(0, valueDropdown.displayCount)
              .map(type => (
                <div
                  key={type}
                  className="field-option"
                  onClick={() => {
                    conditionState.handleValueChange(type);
                    valueDropdown.setCurrentValue(type);
                    valueDropdown.setIsOpen(false);
                    valueDropdown.setSearchTerm('');
                  }}
                >
                  {type}
                </div>
              ))}
            {valueDropdown.displayCount < resourceTypes.length && (
              <div className="field-option-loading">Loading more...</div>
            )}
          </Dropdown>
        ) : null}
      />
    );
  };

  return (
    <div className="condition-editor">
      {/* NOT operator toggle */}
      <NotToggle 
        checked={conditionState.isNot}
        onChange={conditionState.handleNotToggle}
      />

      {/* Field selection input with dropdown */}
      <SearchableInput
        inputRef={inputRef}
        value={fieldDropdown.currentValue}
        searchTerm={fieldDropdown.searchTerm}
        isOpen={fieldDropdown.isOpen}
        placeholder="Search fields or enter custom value..."
        onChange={(value) => {
          conditionState.handleFieldChange(value);
          fieldDropdown.setCurrentValue(value);
        }}
        onSearchChange={fieldDropdown.setSearchTerm}
        onFocus={fieldDropdown.handleInputFocus}
        onBlur={() => fieldDropdown.handleBlur((value) => {
          conditionState.handleFieldChange(value);
          fieldDropdown.setCurrentValue(value);
        })}
        dropdownContent={
          <Dropdown
            isOpen={fieldDropdown.isOpen}
            position={fieldDropdown.position}
            width={inputRef.current?.offsetWidth}
            onScroll={fieldDropdown.handleScroll}
          >
            {AVAILABLE_FIELDS
              .filter(field => field.display.toLowerCase().includes(fieldDropdown.searchTerm.toLowerCase()))
              .slice(0, fieldDropdown.displayCount)
              .map(field => (
                <div
                  key={field.value}
                  className="field-option"
                  onClick={() => {
                    const valueWithoutParens = field.display.split(' (')[0];
                    conditionState.handleFieldChange(valueWithoutParens);
                    fieldDropdown.setCurrentValue(valueWithoutParens);
                    fieldDropdown.setIsOpen(false);
                    fieldDropdown.setSearchTerm('');
                  }}
                >
                  {field.display}
                </div>
              ))}
            {fieldDropdown.displayCount < AVAILABLE_FIELDS.length && (
              <div className="field-option-loading">Loading more...</div>
            )}
          </Dropdown>
        }
      />

      {/* Operator selection dropdown */}
      <OperatorSelect
        value={conditionState.operator}
        onChange={conditionState.handleOperatorChange}
      />

      {/* Value input field */}
      {renderValueInput()}
    </div>
  );
};

export default ConditionEditor;