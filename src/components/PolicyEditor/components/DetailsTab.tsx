import React from 'react';
import { DetailsForm } from '../../DetailsForm';
import { PolicyTemplate } from '../../../types/policy';

/**
 * Props interface for the DetailsTab component
 * @property policy - The current policy template being edited
 * @property onUpdateDetails - Callback function to handle updates to policy details
 */
interface DetailsTabProps {
  policy: PolicyTemplate;
  onUpdateDetails: (details: {
    roleDefinitionIds: string[];     // Array of role IDs to be assigned
    conflictEffect?: string;         // Effect to apply on conflicts
    operations: Array<{              // Array of modification operations
      operation: string;             // Type of operation (add, remove, etc.)
      field: string;                 // Field to be modified
      value: string;                 // New value for the field
    }>;
  }) => void;
}

/**
 * DetailsTab component for managing policy details configuration
 * 
 * This component serves as a container for the DetailsForm, providing access to:
 * - Role assignments configuration
 * - Conflict resolution settings
 * - Policy modification operations
 * 
 * It extracts the relevant details from the policy template and passes them
 * to the DetailsForm component for editing.
 * 
 * @example
 * <DetailsTab
 *   policy={currentPolicy}
 *   onUpdateDetails={handleDetailsUpdate}
 * />
 */
export const DetailsTab: React.FC<DetailsTabProps> = ({
  policy,
  onUpdateDetails
}) => {
  return (
    <div className="details-tab">
      <DetailsForm
        roleDefinitionIds={policy.properties.policyRule.then.details?.roleDefinitionIds || []}
        conflictEffect={policy.properties.policyRule.then.details?.conflictEffect || ''}
        operations={policy.properties.policyRule.then.details?.operations || []}
        onUpdate={onUpdateDetails}
      />
    </div>
  );
}; 