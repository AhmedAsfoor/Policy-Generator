import React, { RefObject, memo } from 'react';
import '../../../styles/PolicyEditor.css';

/**
 * Props interface for the SearchableInput component
 * @property inputRef - Reference to the input element for direct DOM manipulation
 * @property value - The current value of the input when not in search mode
 * @property searchTerm - The current search term when dropdown is open
 * @property isOpen - Boolean flag indicating if the search dropdown is open
 * @property placeholder - Placeholder text for the input field
 * @property onChange - Callback for when the main value changes
 * @property onSearchChange - Callback for when the search term changes
 * @property onFocus - Callback for when the input receives focus
 * @property onBlur - Callback for when the input loses focus
 * @property dropdownContent - Optional ReactNode for dropdown content
 */
interface SearchableInputProps {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  searchTerm: string;
  isOpen: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onSearchChange: (term: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  dropdownContent?: React.ReactNode;
}

/**
 * SearchableInput component for creating searchable dropdown inputs
 * 
 * This component combines an input field with dropdown functionality,
 * allowing users to either directly input values or search through
 * options in a dropdown. It manages two states: the actual value
 * and the search term when the dropdown is open.
 * 
 * @example
 * <SearchableInput
 *   inputRef={ref}
 *   value={selectedValue}
 *   searchTerm={searchTerm}
 *   isOpen={isDropdownOpen}
 *   placeholder="Search..."
 *   onChange={handleValueChange}
 *   onSearchChange={handleSearch}
 *   onFocus={handleFocus}
 *   onBlur={handleBlur}
 *   dropdownContent={<DropdownList items={filteredItems} />}
 * />
 */
export const SearchableInput = memo<SearchableInputProps>(({
  inputRef,
  value,
  searchTerm,
  isOpen,
  placeholder,
  onChange,
  onSearchChange,
  onFocus,
  onBlur,
  dropdownContent
}) => (
  <div className="searchable-dropdown">
    <input
      ref={inputRef}
      type="text"
      value={isOpen ? searchTerm : value}
      onChange={(e) => {
        const newValue = e.target.value;
        if (!isOpen) {
          onChange(newValue);
        }
        onSearchChange(newValue);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className="field-search-input"
    />
    {dropdownContent}
  </div>
));

// Set display name for debugging purposes
SearchableInput.displayName = 'SearchableInput';