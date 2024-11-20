import React from 'react';
import { SearchableInput } from '../../ConditionEditor/components/SearchableInput';
import { useDropdown } from '../../ConditionEditor/hooks/useDropdown';
import { ARRAY_FIELDS } from '../../../constants/policy';
import { Dropdown } from '../../ConditionEditor/components/Dropdown';

/**
 * Props interface for the CountFieldSelect component
 * @property value - Currently selected field value
 * @property onChange - Callback function triggered when a new field is selected
 */
interface CountFieldSelectProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * CountFieldSelect component for selecting array fields in count conditions
 * 
 * This component provides a searchable dropdown interface for selecting array fields
 * that can be used in count conditions. It supports:
 * - Field searching
 * - Dropdown selection
 * - Custom value input
 * - Infinite scrolling
 * 
 * @example
 * <CountFieldSelect
 *   value={selectedField}
 *   onChange={handleFieldChange}
 * />
 */
export const CountFieldSelect: React.FC<CountFieldSelectProps> = ({
  value,
  onChange
}) => {
  // Reference for the input element
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Initialize dropdown state and handlers
  const {
    isOpen,
    searchTerm,
    displayCount,
    position,
    handleInputFocus,
    handleScroll,
    setSearchTerm,
    handleBlur,
    setIsOpen
  } = useDropdown(inputRef, 50, ARRAY_FIELDS.length, value);

  /**
   * Memoized filtered fields based on search term
   * Filters array fields that match the search term and limits display count
   */
  const filteredFields = React.useMemo(() => 
    ARRAY_FIELDS
      .filter(field => 
        field.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, displayCount),
    [searchTerm, displayCount]
  );

  return (
    <SearchableInput
      inputRef={inputRef}
      value={value}
      searchTerm={searchTerm}
      isOpen={isOpen}
      placeholder="Search fields or enter custom value..."
      onChange={onChange}
      onSearchChange={setSearchTerm}
      onFocus={handleInputFocus}
      onBlur={() => {
        setTimeout(() => {
          handleBlur(onChange);
          setIsOpen(false);
        }, 200);
      }}
      dropdownContent={
        <Dropdown
          isOpen={isOpen}
          position={position}
          width={inputRef.current?.offsetWidth}
          onScroll={handleScroll}
        >
          {filteredFields.map(field => (
            <div
              key={field.value}
              className="field-option"
              onClick={() => {
                const valueWithoutParens = field.value.split(' (')[0];
                onChange(valueWithoutParens);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              {field.display}
            </div>
          ))}
        </Dropdown>
      }
    />
  );
}; 