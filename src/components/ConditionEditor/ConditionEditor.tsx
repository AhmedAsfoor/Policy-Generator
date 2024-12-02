/**
 * ConditionEditor Component
 * 
 * A complex component that provides a complete interface for editing Azure Policy conditions.
 * It allows users to build and modify policy conditions through a user-friendly interface.
 * 
 * Features:
 * - Field selection with searchable dropdown and resource type grouping
 * - Operator selection based on field type
 * - Dynamic value input with context-aware suggestions
 * - NOT operator toggle for negating conditions
 * - Support for both simple and complex conditions
 * 
 * @component
 */

import React, { useRef } from 'react';
import { AVAILABLE_FIELDS, OPERATOR_PLACEHOLDERS, COMMON_FIELDS, GROUPED_ALIASES } from '../../constants/policy';
import type { SimpleCondition, NotCondition } from '../../types/policy';
import resourceTypes from '../../data/azure_resource_types.json';
import { useDropdown } from './hooks/useDropdown';
import { useCondition } from './hooks/useCondition';
import { NotToggle } from './components/NotToggle';
import { OperatorSelect } from './components/OperatorSelect';
import { SearchableInput } from './components/SearchableInput';
import { Dropdown } from './components/Dropdown';

/**
 * Props for the ConditionEditor component
 * 
 * @property condition - The current condition object being edited. Can be either a simple condition
 *                      or a NOT condition that negates another condition.
 * @property onUpdate - Callback function triggered when the condition is modified. Receives the
 *                     updated condition object as its argument.
 */
interface ConditionEditorProps {
  condition: SimpleCondition | NotCondition;
  onUpdate: (condition: SimpleCondition | NotCondition) => void;
}

// Constants for pagination in dropdowns
const ITEMS_PER_PAGE = 50;
const VALUE_ITEMS_PER_PAGE = 50;

/**
 * Represents a field option in the dropdown
 * 
 * @property display - The text to display in the UI
 * @property value - The actual value used in the condition
 */
interface Field {
  display: string;
  value: string;
}

/**
 * Represents a group of fields in the dropdown
 * 
 * @property resourceType - The name of the resource type that groups the fields
 * @property fields - Array of Field objects belonging to this group
 */
interface FieldGroup {
  resourceType: string;
  fields: Field[];
}

/**
 * Renders a header for grouped fields in the dropdown
 * 
 * @component
 * @property resourceType - The name of the resource type group to display
 */
const GroupHeader: React.FC<{ resourceType: string }> = ({ resourceType }) => (
  <div className="field-group-header">
    {resourceType}
  </div>
);

/**
 * The main ConditionEditor component
 * 
 * Provides a complete interface for editing Azure Policy conditions with features like:
 * - Searchable field selection with resource type grouping
 * - Context-aware operator selection
 * - Dynamic value input with suggestions
 * - NOT condition toggle
 * - Infinite scrolling for large lists
 * 
 * The component uses custom hooks for managing complex state:
 * - useDropdown: Manages dropdown state and pagination
 * - useCondition: Handles condition state and updates
 * 
 * @example
 * ```tsx
 * <ConditionEditor
 *   condition={{
 *     field: "type",
 *     operator: "equals",
 *     value: "Microsoft.Storage/storageAccounts"
 *   }}
 *   onUpdate={(updatedCondition) => handleConditionUpdate(updatedCondition)}
 * />
 * ```
 */
export const ConditionEditor: React.FC<ConditionEditorProps> = ({ condition, onUpdate }) => {
  // Refs for input elements to manage focus and positioning
  const inputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  // Initialize condition state management
  const conditionState = useCondition(condition, onUpdate);

  // Initialize dropdown states for field and value selection
  const fieldDropdown = useDropdown(
    inputRef,
    ITEMS_PER_PAGE,
    AVAILABLE_FIELDS.length,
    conditionState.simpleCondition.field
  );

  const valueDropdown = useDropdown(
    valueInputRef,
    VALUE_ITEMS_PER_PAGE,
    resourceTypes.length,
    conditionState.value
  );

  /**
   * Renders the value input field with appropriate dropdown content
   * Handles different behavior based on field type (resource type vs other fields)
   * 
   * @returns JSX.Element The rendered value input component
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

  /**
   * Renders the field options in the dropdown
   * Groups the fields by resource type and handles filtering
   * 
   * @returns JSX.Element The rendered field options
   */
  const renderFieldOptions = () => {
    const searchTerm = fieldDropdown.searchTerm.toLowerCase();
    const filteredGroups: FieldGroup[] = [];
    let totalItems = 0;

    // Add common fields first
    const filteredCommonFields = COMMON_FIELDS
      .filter((field: Field) => field.display.toLowerCase().includes(searchTerm));
    
    if (filteredCommonFields.length > 0) {
      filteredGroups.push({
        resourceType: 'Common Fields',
        fields: filteredCommonFields
      });
      totalItems += filteredCommonFields.length;
    }

    // Add resource type groups
    for (const group of GROUPED_ALIASES) {
      const filteredFields = group.fields
        .filter((field: Field) => field.display.toLowerCase().includes(searchTerm));

      if (filteredFields.length > 0) {
        filteredGroups.push({
          resourceType: group.resourceType,
          fields: filteredFields
        });
        totalItems += filteredFields.length;
      }

      if (totalItems >= fieldDropdown.displayCount) break;
    }

    return (
      <>
        {filteredGroups.map(group => (
          <React.Fragment key={group.resourceType}>
            <GroupHeader resourceType={group.resourceType} />
            {group.fields.map((field: Field) => (
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
          </React.Fragment>
        ))}
        {totalItems < AVAILABLE_FIELDS.length && (
          <div className="field-option-loading">Loading more...</div>
        )}
      </>
    );
  };

  return (
    <div className="condition-editor">
      {/* NOT operator toggle */}
      <NotToggle 
        checked={conditionState.isNot}
        onChange={conditionState.handleNotToggle}
      />

      {/* Field selection input with grouped dropdown */}
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
            {renderFieldOptions()}
          </Dropdown>
        }
      />

      {/* Operator selection dropdown */}
      <OperatorSelect
        value={conditionState.operator}
        onChange={conditionState.handleOperatorChange}
      />

      {/* Value input field with context-aware suggestions */}
      {renderValueInput()}
    </div>
  );
};

export default ConditionEditor;