import React from 'react';
import { DetailsFormProps } from './types';
import { RoleSelection } from './components/RoleSelection';
import { ConflictEffect } from './components/ConflictEffect';
import { OperationsList } from './components/OperationsList';

/**
 * DetailsForm component for managing policy details configuration
 * 
 * This component provides a complete interface for configuring policy details including:
 * - Role assignments through role definition IDs
 * - Conflict resolution strategy
 * - Policy modification operations
 * 
 * The component maintains a consistent state update pattern, ensuring that all
 * updates preserve existing values for other fields while updating specific sections.
 * 
 * @example
 * <DetailsForm
 *   roleDefinitionIds={['role1', 'role2']}
 *   conflictEffect="audit"
 *   operations={[]}
 *   onUpdate={handleUpdate}
 * />
 */
export const DetailsForm: React.FC<DetailsFormProps> = ({
  roleDefinitionIds,
  conflictEffect,
  operations,
  onUpdate
}) => {
  /**
   * Handles updates to role assignments
   * Preserves existing conflict effect and operations
   */
  const handleUpdateRoles = (newRoleIds: string[]) => {
    onUpdate({
      roleDefinitionIds: newRoleIds,
      ...(conflictEffect && { conflictEffect }),
      operations
    });
  };

  /**
   * Handles updates to conflict effect setting
   * Preserves existing roles and operations
   */
  const handleUpdateEffect = (newEffect: string | undefined) => {
    onUpdate({
      roleDefinitionIds,
      ...(newEffect && { conflictEffect: newEffect }),
      operations
    });
  };

  /**
   * Handles updates to operations list
   * Preserves existing roles and conflict effect
   */
  const handleUpdateOperations = (newOperations: typeof operations) => {
    onUpdate({
      roleDefinitionIds,
      ...(conflictEffect && { conflictEffect }),
      operations: newOperations
    });
  };

  return (
    <div className="details-form">
      {/* Role selection component */}
      <RoleSelection 
        roleDefinitionIds={roleDefinitionIds}
        onUpdateRoles={handleUpdateRoles}
      />
      
      {/* Conflict effect selection */}
      <ConflictEffect
        conflictEffect={conflictEffect}
        onUpdateEffect={handleUpdateEffect}
      />
      
      {/* Operations list management */}
      <OperationsList
        operations={operations}
        onUpdateOperations={handleUpdateOperations}
      />
    </div>
  );
}; 