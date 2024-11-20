import React from 'react';
import { PolicyTemplate } from '../../../types/policy';
import { ParameterForm } from '../../../types/policyEditor';

/**
 * Props interface for the ParametersTab component
 * @property policy - The current policy template being edited
 * @property parameterForm - Form state for parameter editing
 * @property editingParameter - Name of parameter currently being edited (null if adding new)
 * @property nameError - Error message for parameter name validation
 * @property allowedValuesError - Error message for allowed values validation
 * @property defaultValueError - Error message for default value validation
 * @property onParameterFormChange - Callback for form field updates
 * @property onAddParameter - Callback for parameter submission
 * @property onEditParameter - Callback for editing existing parameters
 * @property onRemoveParameter - Callback for removing parameters
 */
interface ParametersTabProps {
  policy: PolicyTemplate;
  parameterForm: ParameterForm;
  editingParameter: string | null;
  nameError: string;
  allowedValuesError: string;
  defaultValueError: string;
  onParameterFormChange: (updates: Partial<ParameterForm>) => void;
  onAddParameter: (e: React.FormEvent) => void;
  onEditParameter: (name: string, param: any) => void;
  onRemoveParameter: (name: string) => void;
}

/**
 * ParametersTab component for managing policy parameters
 * 
 * This component provides a complete interface for managing policy parameters, including:
 * - Adding new parameters with various types
 * - Editing existing parameters
 * - Setting allowed values and default values
 * - Parameter validation
 * - Type-specific input handling
 */
export const ParametersTab: React.FC<ParametersTabProps> = ({
  policy,
  parameterForm,
  editingParameter,
  nameError,
  allowedValuesError,
  defaultValueError,
  onParameterFormChange,
  onAddParameter,
  onEditParameter,
  onRemoveParameter
}) => {
  /**
   * Renders the appropriate input field based on parameter type
   * Handles different input requirements for each type (boolean, number, array, etc.)
   */
  const renderDefaultValueInput = () => {
    switch (parameterForm.type) {
      case 'boolean':
        return (
          <select
            value={parameterForm.defaultValue}
            onChange={(e) => onParameterFormChange({ defaultValue: e.target.value })}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      
      case 'integer':
      case 'float':
        return (
          <input
            type="number"
            value={parameterForm.defaultValue}
            onChange={(e) => onParameterFormChange({ defaultValue: e.target.value })}
            placeholder={`Enter ${parameterForm.type} value`}
            step={parameterForm.type === 'float' ? '0.1' : '1'}
          />
        );
      
      case 'array':
      case 'object':
        return (
          <>
            <textarea
              value={parameterForm.defaultValue}
              onChange={(e) => onParameterFormChange({ defaultValue: e.target.value })}
              placeholder={parameterForm.type === 'array' 
                ? 'Enter JSON array e.g. ["value1","value2"]'
                : 'Enter JSON object e.g. {"key": "value"}'}
              rows={3}
              className={defaultValueError ? 'error' : ''}
            />
            {defaultValueError && (
              <div className="error-message">{defaultValueError}</div>
            )}
          </>
        );
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={parameterForm.defaultValue}
            onChange={(e) => onParameterFormChange({ defaultValue: e.target.value })}
          />
        );
      
      default: // string
        return (
          <>
            <input
              type="text"
              value={parameterForm.defaultValue}
              onChange={(e) => onParameterFormChange({ defaultValue: e.target.value })}
              placeholder="Enter default value"
              className={defaultValueError ? 'error' : ''}
            />
            {defaultValueError && (
              <div className="error-message">{defaultValueError}</div>
            )}
          </>
        );
    }
  };

  return (
    <div className="parameters-tab">
      {/* Parameter form section */}
      <div className="parameters-form">
        <h3>{editingParameter ? 'Edit Parameter' : 'Add Parameter'}</h3>
        <form onSubmit={onAddParameter}>
          {/* Parameter name input */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={parameterForm.name}
              onChange={(e) => onParameterFormChange({ name: e.target.value })}
              placeholder="Enter parameter name"
              className={nameError ? 'error' : ''}
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </div>

          {/* Display name input */}
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={parameterForm.displayName}
              onChange={(e) => onParameterFormChange({ displayName: e.target.value })}
              placeholder="Enter display name"
            />
          </div>

          {/* Parameter type selection */}
          <div className="form-group">
            <label>Type</label>
            <select
              value={parameterForm.type}
              onChange={(e) => onParameterFormChange({ 
                type: e.target.value,
                defaultValue: '',
                allowedValues: []
              })}
            >
              <option value="string">string</option>
              <option value="array">array</option>
              <option value="object">object</option>
              <option value="boolean">boolean</option>
              <option value="integer">integer</option>
              <option value="float">float</option>
              <option value="datetime">datetime</option>
            </select>
          </div>

          {/* Parameter description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={parameterForm.description}
              onChange={(e) => onParameterFormChange({ description: e.target.value })}
              placeholder="Enter parameter description"
              rows={3}
            />
          </div>

          {/* Allowed values input */}
          <div className="form-group">
            <label>Allowed Values</label>
            <input
              type="text"
              value={parameterForm.allowedValues[0] || ''}
              onChange={(e) => onParameterFormChange({ allowedValues: [e.target.value] })}
              placeholder='Enter allowed values e.g. ["value1","value2"]'
              className={allowedValuesError ? 'error' : ''}
            />
            {allowedValuesError && (
              <div className="error-message">{allowedValuesError}</div>
            )}
          </div>

          {/* Default value input */}
          <div className="form-group">
            <label>Default Value</label>
            {renderDefaultValueInput()}
          </div>

          <button type="submit" className="add-parameter-button">
            {editingParameter ? 'Update Parameter' : 'Add Parameter'}
          </button>
        </form>
      </div>

      {/* Existing parameters section */}
      <div className="existing-parameters">
        <h3>Existing Parameters</h3>
        {Object.entries(policy.properties.parameters).map(([name, param]) => (
          <div key={name} className="parameter-item">
            <div className="parameter-header">
              <h4>{name}</h4>
              <div className="parameter-actions">
                {name !== 'effect' && (
                  <>
                    <button 
                      className="edit-parameter"
                      onClick={() => onEditParameter(name, param)}
                      title="Edit Parameter"
                    >
                      ✎
                    </button>
                    <button 
                      className="remove-parameter"
                      onClick={() => onRemoveParameter(name)}
                      title="Remove Parameter"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="parameter-details">
              <div>Type: {param.type}</div>
              <div>Description: {param.metadata.description}</div>
              {param.allowedValues && (
                <div>Allowed Values: {param.allowedValues.join(', ')}</div>
              )}
              <div>Default Value: {
                typeof param.defaultValue === 'object' 
                  ? JSON.stringify(param.defaultValue)
                  : param.defaultValue
              }</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 