import { useState } from 'react';
import { PolicyTemplate, Condition, NestedCondition } from '../../../types/policy';
import { TabType } from '../../../types/policyEditor';
import { initialPolicyTemplate } from '../../../constants/policy';

/**
 * Type for the IF clause in policy rules
 * Can be either a nested condition or a negated nested condition
 */
type PolicyRuleIf = NestedCondition | { not: NestedCondition };

/**
 * Custom hook for managing policy editor state and operations
 * 
 * This hook provides comprehensive functionality for managing the entire policy state,
 * including:
 * - Basic policy information
 * - Conditions and logical operators
 * - Effect settings
 * - Parameters
 * - Tab navigation
 * 
 * @returns Object containing policy state and handlers
 */
export const usePolicyEditorState = () => {
  // Initialize policy state with template
  const [policy, setPolicy] = useState<PolicyTemplate>(initialPolicyTemplate);
  const [selectedEffect, setSelectedEffect] = useState<string>('audit');
  const [activeTab, setActiveTab] = useState<TabType>('basicInfo');

  /**
   * Updates the policy display name
   * @param value - New display name
   */
  const handleDisplayNameChange = (value: string) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        displayName: value
      }
    }));
  };

  /**
   * Updates the policy description
   * @param value - New description
   */
  const handleDescriptionChange = (value: string) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        description: value
      }
    }));
  };

  /**
   * Updates the policy category
   * @param value - New category
   */
  const handleCategoryChange = (value: string) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        metadata: {
          ...prev.properties.metadata,
          category: value
        }
      }
    }));
  };

  /**
   * Updates the policy mode
   * @param value - New mode
   */
  const handleModeChange = (value: string) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        mode: value
      }
    }));
  };

  /**
   * Updates the policy effect and related settings
   * Handles special configuration for 'modify' effect
   * @param value - New effect value
   */
  const handleEffectChange = (value: string) => {
    // Capitalize first letter for the default value
    const defaultValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    
    setSelectedEffect(value);
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        parameters: {
          ...prev.properties.parameters,
          effect: {
            ...prev.properties.parameters.effect,
            allowedValues: value.toLowerCase() === 'modify' ? ['Modify', 'Disabled'] : ['Audit', 'Deny', 'Disabled'],
            defaultValue: defaultValue
          }
        },
        policyRule: {
          ...prev.properties.policyRule,
          then: value.toLowerCase() === 'modify' ? {
            effect: "[parameters('effect')]",
            details: {
              roleDefinitionIds: [],
              operations: [{
                operation: 'add',
                field: '',
                value: ''
              }]
            }
          } : {
            effect: "[parameters('effect')]"
          }
        }
      }
    }));
  };

  /**
   * Handles direct JSON edits to the policy
   * Validates JSON format before updating
   * @param value - New policy JSON string
   */
  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    try {
      const updatedPolicy = JSON.parse(value);
      setPolicy(updatedPolicy);
    } catch (error) {
      console.warn('Invalid JSON:', error);
    }
  };

  /**
   * Updates policy conditions while preserving structure
   * @param conditions - New conditions array
   */
  const handleUpdateConditions = (conditions: Condition[]) => {
    const type = getCurrentGroupType();
    const isNot = isRootNot();
    
    // Create new condition while preserving NOT wrapper if it exists
    const newIfCondition: PolicyRuleIf = isNot
      ? { not: { [type]: conditions } }
      : { [type]: conditions };

    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        policyRule: {
          ...prev.properties.policyRule,
          if: newIfCondition
        }
      }
    }));
  };

  /**
   * Checks if the root condition is negated
   */
  const isRootNot = (): boolean => {
    return 'not' in policy.properties.policyRule.if;
  };

  /**
   * Gets the current group type (allOf/anyOf)
   */
  const getCurrentGroupType = (): 'allOf' | 'anyOf' => {
    const ifCondition = isRootNot() 
      ? (policy.properties.policyRule.if as { not: NestedCondition }).not 
      : policy.properties.policyRule.if as NestedCondition;
    
    return 'allOf' in ifCondition ? 'allOf' : 'anyOf';
  };

  /**
   * Toggles between allOf and anyOf for the root condition group
   */
  const handleToggleGroupType = () => {
    const currentType = getCurrentGroupType();
    const newType = currentType === 'allOf' ? 'anyOf' : 'allOf';
    const conditions = getCurrentConditions();
    
    const newIfCondition: PolicyRuleIf = isRootNot()
      ? { not: { [newType]: conditions } }
      : { [newType]: conditions };
    
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        policyRule: {
          ...prev.properties.policyRule,
          if: newIfCondition
        }
      }
    }));
  };

  /**
   * Toggles the NOT operator for the root condition
   */
  const handleToggleNot = () => {
    const type = getCurrentGroupType();
    const conditions = getCurrentConditions();
    
    const newIfCondition: PolicyRuleIf = isRootNot()
      ? { [type]: conditions }
      : { not: { [type]: conditions } };
    
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        policyRule: {
          ...prev.properties.policyRule,
          if: newIfCondition
        }
      }
    }));
  };

  /**
   * Gets the current conditions array
   */
  const getCurrentConditions = (): Condition[] => {
    const type = getCurrentGroupType();
    const ifCondition = isRootNot() 
      ? (policy.properties.policyRule.if as { not: NestedCondition }).not 
      : policy.properties.policyRule.if as NestedCondition;
    return (ifCondition[type] || []) as Condition[];
  };

  /**
   * Updates the details section of the policy
   * Used primarily with 'modify' effect
   */
  const handleUpdateDetails = (details: any) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        policyRule: {
          ...prev.properties.policyRule,
          then: {
            effect: "[parameters('effect')]",
            details
          }
        }
      }
    }));
  };

  /**
   * Updates a specific parameter in the policy
   */
  const handleUpdateParameter = (name: string, parameter: any) => {
    setPolicy(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        parameters: {
          ...prev.properties.parameters,
          [name]: parameter
        }
      }
    }));
  };

  /**
   * Removes a parameter from the policy
   * Prevents removal of the 'effect' parameter
   */
  const handleRemoveParameter = (name: string) => {
    if (name === 'effect') return;
    
    setPolicy(prev => {
      const newParameters = { ...prev.properties.parameters };
      delete newParameters[name];
      return {
        ...prev,
        properties: {
          ...prev.properties,
          parameters: newParameters
        }
      };
    });
  };

  return {
    policy,
    setPolicy,
    selectedEffect,
    setSelectedEffect,
    activeTab,
    setActiveTab,
    handleDisplayNameChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleModeChange,
    handleEffectChange,
    handleEditorChange,
    handleUpdateConditions,
    handleToggleGroupType,
    handleToggleNot,
    handleUpdateDetails,
    handleUpdateParameter,
    handleRemoveParameter
  };
}; 