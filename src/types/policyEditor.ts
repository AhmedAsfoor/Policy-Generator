import { PolicyTemplate, Condition, NestedCondition } from './policy';

/**
 * Type for identifying different tabs in the policy editor
 * - basicInfo: General policy information and settings
 * - conditions: Policy condition configuration
 * - parameters: Policy parameter management
 * - details: Additional policy details (shown for 'modify' effect)
 */
export type TabType = 'basicInfo' | 'conditions' | 'parameters' | 'details';

/**
 * Interface for parameter form state
 * Used to manage the state of the parameter editing form
 * @property name - Parameter identifier
 * @property type - Parameter data type
 * @property description - Parameter description
 * @property displayName - Human-readable parameter name
 * @property allowedValues - Array of valid values
 * @property defaultValue - Initial value for the parameter
 */
export interface ParameterForm {
  name: string;
  type: string;
  description: string;
  displayName: string;
  allowedValues: string[];
  defaultValue: string;
}

/**
 * Interface for policy parameters
 * Defines the structure of parameters in a policy
 * 
 * Includes a required 'effect' parameter and allows for additional
 * custom parameters with consistent structure.
 */
export interface Parameters {
  // Required effect parameter
  effect: {
    type: string;
    metadata: {
      displayName: string;
      description: string;
    };
    allowedValues: string[];
    defaultValue: string;
  };
  // Additional custom parameters
  [key: string]: {
    type: string;
    metadata: {
      description: string;
      displayName?: string;
    };
    allowedValues?: string[];
    defaultValue: string;
  };
} 