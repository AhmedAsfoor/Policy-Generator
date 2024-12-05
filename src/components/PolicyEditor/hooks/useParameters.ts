import { useState } from 'react';
import { ParameterForm, Parameters } from '../../../types/policyEditor';
import { isValidJSONArray } from '../../../utils/validation';

/**
 * Custom hook for managing policy parameter state and validation
 * 
 * This hook provides comprehensive functionality for managing policy parameters, including:
 * - Parameter form state management
 * - Parameter validation
 * - Error handling
 * - JSON validation for arrays and objects
 * - Parameter type-specific handling
 * 
 * @param initialParameters - Initial parameters object
 * @returns Object containing parameter state and handlers
 */
export const useParameters = (initialParameters: Parameters) => {
  // Initialize parameter form state
  const [parameterForm, setParameterForm] = useState<ParameterForm>({
    name: '',
    type: 'string',
    description: '',
    displayName: '',
    allowedValues: [],
    defaultValue: ''
  });

  // State for tracking editing and validation
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [allowedValuesError, setAllowedValuesError] = useState<string>('');
  const [defaultValueError, setDefaultValueError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  /**
   * Validates parameter name
   * Checks for required field and space characters
   * @param name - Parameter name to validate
   * @returns boolean indicating if name is valid
   */
  const validateParameterName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.includes(' ')) {
      setNameError('Name cannot contain spaces');
      return false;
    }
    setNameError('');
    return true;
  };

  /**
   * Validates the entire parameter form
   * Checks name, allowed values, and type-specific requirements
   * @returns boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    // Validate name
    if (!validateParameterName(parameterForm.name)) {
      return false;
    }

    // Validate allowed values if provided
    if (parameterForm.allowedValues[0] && !isValidJSONArray(parameterForm.allowedValues[0])) {
      setAllowedValuesError('Must be a valid JSON array');
      return false;
    }

    // For object type, validate JSON format
    if (parameterForm.type === 'object' && parameterForm.defaultValue) {
      try {
        JSON.parse(parameterForm.defaultValue);
      } catch (e) {
        setDefaultValueError('Must be a valid JSON object');
        return false;
      }
    }

    return true;
  };

  /**
   * Handles updates to parameter form fields
   * Clears relevant errors when form changes
   * @param updates - Partial form updates to apply
   */
  const handleParameterFormChange = (updates: Partial<ParameterForm>) => {
    setParameterForm(prev => ({ ...prev, ...updates }));
    // Clear errors when form changes
    setNameError('');
    setAllowedValuesError('');
    setDefaultValueError('');
  };

  /**
   * Handles parameter form submission
   * Validates form and creates parameter object
   * @param e - Form event
   * @param onUpdate - Callback to handle parameter updates
   */
  const handleAddParameter = (e: React.FormEvent, onUpdate: (name: string, parameter: any) => void) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create the parameter object
      const parameter = {
        type: parameterForm.type,
        metadata: {
          displayName: parameterForm.displayName,
          description: parameterForm.description
        },
        ...(parameterForm.allowedValues[0] && {
          allowedValues: JSON.parse(parameterForm.allowedValues[0])
        }),
        defaultValue: parameterForm.type === 'object'
          ? (parameterForm.defaultValue ? JSON.parse(parameterForm.defaultValue) : {})
          : parameterForm.type === 'array'
            ? JSON.parse(parameterForm.defaultValue)
            : parameterForm.type === 'integer' || parameterForm.type === 'float'
              ? Number(parameterForm.defaultValue)
              : parameterForm.defaultValue
      };

      // Call the update function provided by the parent
      onUpdate(parameterForm.name, parameter);

      // Reset form
      setParameterForm({
        name: '',
        type: 'string',
        description: '',
        displayName: '',
        allowedValues: [],
        defaultValue: ''
      });
      setEditingParameter(null);
      setAllowedValuesError('');
      setDefaultValueError('');
    } catch (error) {
      console.error('Error adding parameter:', error);
      setDefaultValueError('Invalid JSON format');
    }
  };

  /**
   * Handles editing existing parameters
   * Populates form with parameter values
   * @param name - Name of parameter to edit
   * @param param - Parameter object to edit
   */
  const handleEditParameter = (name: string, param: any) => {
    if (name === 'effect') return;
    
    setParameterForm({
      name,
      type: param.type.toLowerCase(),
      description: param.metadata?.description || '',
      displayName: param.metadata?.displayName || '',
      allowedValues: param.allowedValues ? [JSON.stringify(param.allowedValues)] : [],
      defaultValue: param.type.toLowerCase() === 'array'
        ? JSON.stringify(param.defaultValue, null, 2)
        : param.type.toLowerCase() === 'object'
          ? JSON.stringify(param.defaultValue, null, 2)
          : String(param.defaultValue || '')
    });
    setEditingParameter(name);
  };

  return {
    parameterForm,
    editingParameter,
    nameError,
    allowedValuesError,
    defaultValueError,
    handleParameterFormChange,
    handleAddParameter,
    handleEditParameter,
    setAllowedValuesError,
    setDefaultValueError
  };
}; 