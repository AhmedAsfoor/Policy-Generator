/**
 * AddGroupForm Component
 * 
 * This component provides a form interface for creating logical condition groups in Azure Policies.
 * It allows users to:
 * - Create ANY OF / ALL OF condition groups
 * - Apply NOT operators to condition groups
 * - Build nested policy conditions
 * 
 * The component serves as a factory for creating new condition groups with specific
 * logical operators and negation states.
 */

import { useState } from 'react';
import { Checkbox, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';
import '../styles/PolicyEditor.css';

/**
 * Represents the structure of a condition group in the policy.
 * Can be either:
 * - A simple ANY OF / ALL OF group
 * - A negated (NOT) condition group
 * - A nested combination of the above
 */
interface ConditionType {
  anyOf?: any[];           // Array of conditions combined with OR logic
  allOf?: any[];           // Array of conditions combined with AND logic
  not?: ConditionType;     // Negation of a condition group
}

/**
 * Props for the AddGroupForm component
 * @property onSubmit - Callback function that receives the created condition group
 */
interface AddGroupFormProps {
  onSubmit: (condition: ConditionType) => void;
}

/**
 * Valid logical operators for condition groups
 * - 'anyOf': OR logic between conditions
 * - 'allOf': AND logic between conditions
 */
type GroupType = 'anyOf' | 'allOf';

/**
 * AddGroupForm Component
 * 
 * Provides a form interface for creating new condition groups with specific
 * logical operators (ANY OF / ALL OF) and optional NOT negation.
 * 
 * @example
 * <AddGroupForm 
 *   onSubmit={(condition) => {
 *     console.log('New condition group:', condition);
 *     handleAddGroup(condition);
 *   }} 
 * />
 */
function AddGroupForm({ onSubmit }: AddGroupFormProps) {
  // State for tracking the selected logical operator type
  const [groupType, setGroupType] = useState<GroupType>('anyOf');
  
  // State for tracking whether the condition group should be negated
  const [isNot, setIsNot] = useState<boolean>(false);

  /**
   * Handles form submission by creating and returning the condition structure
   * Prevents default form submission and constructs the condition object
   * based on current state
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Create the base condition structure with empty array
    let condition: ConditionType = {
      [groupType]: []
    };

    // Wrap in NOT operator if negation is selected
    if (isNot) {
      condition = {
        not: condition
      };
    }

    onSubmit(condition);
  };

  /**
   * Updates the group type when user changes the logical operator
   * @param e - Select element change event
   */
  const handleGroupTypeChange = (e: SelectChangeEvent): void => {
    setGroupType(e.target.value as GroupType);
  };

  /**
   * Toggles the NOT operator when checkbox is clicked
   * @param e - Checkbox change event
   */
  const handleNotChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsNot(e.target.checked);
  };

  // Memoized styles to prevent recreation on each render
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    } as const,
    
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center'
    } as const,
    
    select: {
      minWidth: 120
    } as const
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.container}>
        {/* NOT operator toggle */}
        <div style={styles.checkboxContainer}>
          <Checkbox
            checked={isNot}
            onChange={handleNotChange}
            size="small"
            aria-label="Negate condition"
          />
          <span className="group-type-select">{groupType}</span>
        </div>

        {/* Group type selector */}
        <Select
          value={groupType}
          onChange={handleGroupTypeChange}
          size="small"
          sx={styles.select}
          aria-label="Select group type"
        >
          <MenuItem value="anyOf">ANY OF</MenuItem>
          <MenuItem value="allOf">ALL OF</MenuItem>
        </Select>
      </div>
    </form>
  );
}

export default AddGroupForm;