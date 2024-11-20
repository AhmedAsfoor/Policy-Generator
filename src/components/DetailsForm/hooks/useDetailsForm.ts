import { useState, useRef, useEffect } from 'react';
import { Operation, FieldDropdownState, FieldSearchState, FieldDropdownPositions } from '../types';

/**
 * Custom hook for managing details form state and operations
 * 
 * This hook provides comprehensive functionality for managing form state including:
 * - Role definition management
 * - Conflict effect handling
 * - Operations list management
 * - Dropdown positioning and state
 * - Search functionality
 * 
 * @param roleDefinitionIds - Array of selected role definition IDs
 * @param conflictEffect - Selected conflict effect
 * @param operations - Array of current operations
 * @param onUpdate - Callback function to handle form updates
 * 
 * @example
 * const {
 *   handleAddOperation,
 *   handleRemoveOperation,
 *   handleOperationChange,
 *   updateFieldDropdownPosition
 * } = useDetailsForm(roles, effect, operations, handleUpdate);
 */
export const useDetailsForm = (
  roleDefinitionIds: string[],
  conflictEffect: string | undefined,
  operations: Operation[],
  onUpdate: (details: {
    roleDefinitionIds: string[];
    conflictEffect?: string;
    operations: Operation[];
  }) => void
) => {
  // State for search and dropdown functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fieldSearchTerms, setFieldSearchTerms] = useState<FieldSearchState>({});
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState<FieldDropdownState>({});
  const [fieldDropdownPositions, setFieldDropdownPositions] = useState<FieldDropdownPositions>({});

  // Refs for dropdown positioning
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fieldDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const fieldInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  /**
   * Adds a new operation to the list
   * Preserves existing role definitions and conflict effect
   */
  const handleAddOperation = () => {
    onUpdate({
      roleDefinitionIds,
      ...(conflictEffect && { conflictEffect }),
      operations: [...operations, { operation: '', field: '', value: '' }]
    });
  };

  /**
   * Removes an operation and cleans up associated state
   * @param index - Index of the operation to remove
   */
  const handleRemoveOperation = (index: number) => {
    const newOperations = operations.filter((_, i) => i !== index);
    
    // Clean up search terms and dropdown state for removed operation
    setFieldSearchTerms(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    
    setIsFieldDropdownOpen(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    
    setFieldDropdownPositions(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });

    // Clean up refs
    delete fieldDropdownRefs.current[index];
    delete fieldInputRefs.current[index];

    // Update form state
    onUpdate({
      roleDefinitionIds,
      ...(conflictEffect && { conflictEffect }),
      operations: newOperations
    });
  };

  /**
   * Updates a specific field of an operation
   * @param index - Index of the operation to update
   * @param field - Field to update
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
    
    onUpdate({
      roleDefinitionIds,
      ...(conflictEffect && { conflictEffect }),
      operations: newOperations
    });
  };

  /**
   * Updates the position of a field dropdown
   * Calculates position based on available space and scroll position
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

  /**
   * Effect to handle clicks outside the dropdown
   * Closes the dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    isDropdownOpen,
    setIsDropdownOpen,
    fieldSearchTerms,
    setFieldSearchTerms,
    isFieldDropdownOpen,
    setIsFieldDropdownOpen,
    fieldDropdownPositions,
    dropdownRef,
    fieldDropdownRefs,
    fieldInputRefs,
    handleAddOperation,
    handleRemoveOperation,
    handleOperationChange,
    updateFieldDropdownPosition
  };
}; 