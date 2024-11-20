import React from 'react';
import { PolicyTemplate } from '../../../types/policy';

/**
 * Props interface for the BasicInfoTab component
 * @property policy - The current policy template being edited
 * @property selectedEffect - Currently selected policy effect
 * @property onDisplayNameChange - Callback for updating display name
 * @property onDescriptionChange - Callback for updating description
 * @property onCategoryChange - Callback for updating category
 * @property onModeChange - Callback for updating policy mode
 * @property onEffectChange - Callback for updating policy effect
 */
interface BasicInfoTabProps {
  policy: PolicyTemplate;
  selectedEffect: string;
  onDisplayNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onModeChange: (value: string) => void;
  onEffectChange: (value: string) => void;
}

/**
 * BasicInfoTab component for editing basic policy information
 * 
 * This component provides form fields for editing fundamental policy attributes:
 * - Display Name: Human-readable name for the policy
 * - Description: Detailed explanation of the policy's purpose
 * - Category: Policy classification (Security, Monitoring, etc.)
 * - Mode: Policy evaluation mode (All or Indexed)
 * - Effect: Policy enforcement behavior (Audit, Deny, etc.)
 * 
 * @example
 * <BasicInfoTab
 *   policy={currentPolicy}
 *   selectedEffect="audit"
 *   onDisplayNameChange={handleDisplayNameChange}
 *   onDescriptionChange={handleDescriptionChange}
 *   onCategoryChange={handleCategoryChange}
 *   onModeChange={handleModeChange}
 *   onEffectChange={handleEffectChange}
 * />
 */
export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  policy,
  selectedEffect,
  onDisplayNameChange,
  onDescriptionChange,
  onCategoryChange,
  onModeChange,
  onEffectChange
}) => {
  return (
    <div className="tab-content">
      <div className="basic-info-form">
        {/* Display Name input */}
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            value={policy.properties.displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="Enter display name"
          />
        </div>
        
        {/* Description textarea */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={policy.properties.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter description"
            rows={4}
          />
        </div>
        
        {/* Category selection */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={policy.properties.metadata.category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Security">Security</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Backup">Backup</option>
            <option value="Storage">Storage</option>
            <option value="Network">Network</option>
            <option value="Compute">Compute</option>
            <option value="General">General</option>
          </select>
        </div>
        
        {/* Mode selection */}
        <div className="form-group">
          <label>Mode</label>
          <select
            value={policy.properties.mode}
            onChange={(e) => onModeChange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Indexed">Indexed</option>
          </select>
        </div>

        {/* Effect selection */}
        <div className="form-group">
          <label>Effect</label>
          <select
            value={selectedEffect}
            onChange={(e) => onEffectChange(e.target.value)}
          >
            <option value="audit">Audit</option>
            <option value="deny">Deny</option>
            <option value="modify">Modify</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 