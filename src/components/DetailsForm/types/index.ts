/**
 * Interface for policy modification operations
 * @property condition - Optional condition for when the operation should be applied
 * @property operation - Type of operation (addOrReplace, add, remove)
 * @property field - Field to be modified
 * @property value - New value for the field
 */
export interface Operation {
  condition?: string;
  operation: string;
  field: string;
  value: string;
}

/**
 * Props interface for the DetailsForm component
 * @property roleDefinitionIds - Array of selected role definition IDs
 * @property conflictEffect - Optional effect to apply on conflicts
 * @property operations - Array of modification operations
 * @property onUpdate - Callback for form updates
 */
export interface DetailsFormProps {
  roleDefinitionIds: string[];
  conflictEffect?: string;
  operations: Operation[];
  onUpdate: (details: {
    roleDefinitionIds: string[];
    conflictEffect?: string;
    operations: Operation[];
  }) => void;
}

/**
 * Props interface for the RoleSelection component
 * @property roleDefinitionIds - Array of selected role IDs
 * @property onUpdateRoles - Callback for role selection updates
 */
export interface RoleSelectionProps {
  roleDefinitionIds: string[];
  onUpdateRoles: (newRoleIds: string[]) => void;
}

/**
 * Props interface for the ConflictEffect component
 * @property conflictEffect - Currently selected conflict effect
 * @property onUpdateEffect - Callback for effect selection updates
 */
export interface ConflictEffectProps {
  conflictEffect?: string;
  onUpdateEffect: (effect: string | undefined) => void;
}

/**
 * Props interface for the OperationsList component
 * @property operations - Array of current operations
 * @property onUpdateOperations - Callback for operations list updates
 */
export interface OperationsListProps {
  operations: Operation[];
  onUpdateOperations: (operations: Operation[]) => void;
}

/**
 * Interface for tracking dropdown open states by index
 */
export interface FieldDropdownState {
  [key: number]: boolean;
}

/**
 * Interface for tracking search terms by index
 */
export interface FieldSearchState {
  [key: number]: string;
}

/**
 * Interface for dropdown position coordinates
 * @property top - Vertical position in pixels
 * @property left - Horizontal position in pixels
 */
export interface DropdownPosition {
  top: number;
  left: number;
}

/**
 * Interface for tracking dropdown positions by index
 */
export interface FieldDropdownPositions {
  [key: number]: DropdownPosition;
} 