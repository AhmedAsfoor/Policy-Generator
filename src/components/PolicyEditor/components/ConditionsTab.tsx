import React from 'react';
import { ConditionGroup } from '../../ConditionGroup';
import { PolicyTemplate, Condition } from '../../../types/policy';

/**
 * Props interface for the ConditionsTab component
 * @property policy - The current policy template being edited
 * @property onUpdateConditions - Callback for updating policy conditions
 * @property onToggleGroupType - Callback for toggling between allOf/anyOf
 * @property onToggleNot - Callback for toggling NOT operator
 */
interface ConditionsTabProps {
  policy: PolicyTemplate;
  onUpdateConditions: (conditions: Condition[]) => void;
  onToggleGroupType: () => void;
  onToggleNot: () => void;
}

/**
 * ConditionsTab component for managing policy conditions
 * 
 * This component provides an interface for editing policy conditions, including:
 * - Managing root-level condition groups
 * - Handling NOT operations at the policy level
 * - Supporting allOf/anyOf logical operators
 * - Managing condition hierarchies
 * 
 * @example
 * <ConditionsTab
 *   policy={currentPolicy}
 *   onUpdateConditions={handleConditionsUpdate}
 *   onToggleGroupType={handleToggleType}
 *   onToggleNot={handleToggleNot}
 * />
 */
export const ConditionsTab: React.FC<ConditionsTabProps> = ({
  policy,
  onUpdateConditions,
  onToggleGroupType,
  onToggleNot
}) => {
  /**
   * Checks if the root condition is negated (wrapped in NOT)
   * @returns boolean indicating if root condition has NOT operator
   */
  const isRootNot = (): boolean => {
    return 'not' in policy.properties.policyRule.if;
  };

  /**
   * Gets the current group type (allOf/anyOf) from the policy
   * Handles both regular and negated conditions
   * @returns The current group type
   */
  const getCurrentGroupType = (): 'allOf' | 'anyOf' => {
    const ifCondition = isRootNot() 
      ? (policy.properties.policyRule.if as { not: any }).not 
      : policy.properties.policyRule.if as any;
    return 'allOf' in ifCondition ? 'allOf' : 'anyOf';
  };

  /**
   * Gets the current conditions array from the policy
   * Handles both regular and negated conditions
   * @returns Array of current conditions
   */
  const getCurrentConditions = (): Condition[] => {
    const type = getCurrentGroupType();
    const ifCondition = isRootNot() 
      ? (policy.properties.policyRule.if as { not: any }).not 
      : policy.properties.policyRule.if as any;
    return (ifCondition[type] || []) as Condition[];
  };

  return (
    <div className="conditions-tab">
      <ConditionGroup
        conditions={getCurrentConditions()}
        type={getCurrentGroupType()}
        path={[]}  // Empty path as this is the root condition group
        isNot={isRootNot()}
        onUpdate={onUpdateConditions}
        onToggleType={onToggleGroupType}
        onToggleNot={onToggleNot}
      />
    </div>
  );
}; 