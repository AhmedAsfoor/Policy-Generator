/**
 * Core Type Definitions for Azure Policy
 * 
 * This file defines the fundamental types and interfaces that model Azure Policy structures.
 * It provides TypeScript type safety for:
 * - Policy conditions and rules
 * - Logical operators and groupings
 * - Policy templates and parameters
 * - Modification operations
 */

/**
 * Simple condition that checks a single field against a value
 * @example { field: "location", equals: "westus" }
 */
export interface SimpleCondition {
  field: string;
  [key: string]: string | string[] | any; // Allow both string and array values
}

/**
 * Nested condition for grouping conditions with logical operators
 * Can contain simple conditions, other nested conditions, or count conditions
 */
export interface NestedCondition {
  allOf?: (SimpleCondition | NestedCondition | CountCondition)[];  // All conditions must be true (AND)
  anyOf?: (SimpleCondition | NestedCondition | CountCondition)[];  // Any condition must be true (OR)
}

/**
 * Count condition for counting matching resources
 * Used to create rules based on the number of resources that match certain criteria
 * @example Count number of VMs in a resource group
 */
export interface CountCondition {
  count: {
    field: string;
    where: {
      allOf?: Condition[];
      anyOf?: Condition[];
    };
  };
  greater?: number;  // Count > n
  less?: number;     // Count < n
  equals?: number;   // Count == n
}

/**
 * Represents a negation of a condition
 * Wraps a condition with a NOT operator
 * @example Not equals to a specific value
 */
export interface NotCondition {
  not: SimpleCondition | NestedCondition;
}

/**
 * Union type of all possible condition types
 * Used when a condition can be any of the supported types
 */
export type Condition = SimpleCondition | NestedCondition | CountCondition | NotCondition;

/**
 * Defines an operation to be performed when a policy rule matches
 */
interface Operation {
  condition?: string;   // Optional condition for the operation
  operation: string;    // Type of operation to perform
  field: string;        // Field to operate on
  value: string;        // Value to use in the operation
}

/**
 * Defines the structure of a policy rule
 * Contains both the condition (if) and the action (then)
 */
export interface PolicyRule {
  if: NestedCondition;
  then: {
    effect: string;     // The action to take (deny, audit, modify, etc.)
    details?: {
      roleDefinitionIds: string[];    // Required roles for the policy
      conflictEffect?: string;        // Optional effect for conflicts
      operations: Operation[];        // Operations to perform
    };
  };
}

/**
 * Main policy template structure
 * Represents a complete Azure Policy definition
 */
export interface PolicyTemplate {
  properties: {
    displayName: string;      // Human-readable name
    policyType: string;       // Type of policy (Custom, BuiltIn)
    mode: string;             // Policy evaluation mode
    description: string;      // Policy description
    metadata: {
      version: string;
      category: string;
      preview: boolean;
    };
    version: string;
    parameters: {             // Policy parameters
      effect: {
        type: string;
        metadata: {
          displayName: string;
          description: string;
        };
        allowedValues: string[];
        defaultValue: string;
      };
      [key: string]: any;    // Additional custom parameters
    };
    policyRule: {
      if: PolicyRuleIf;
      then: {
        effect: string;
        details?: {
          roleDefinitionIds: string[];
          conflictEffect?: string;
          operations: Operation[];
        };
      };
    };
  };
}

/**
 * Alternative condition grouping structure
 * Used for simpler condition groups
 */
export type GroupCondition = {
  anyOf?: Condition[];
  not?: {
    anyOf: Condition[];
  };
};

/**
 * Details for policy operations
 */
interface Details {
  roleDefinitionIds: string[];    // Required roles
  conflictEffect?: string;        // How to handle conflicts
  operations: Operation[];        // List of operations
}

/**
 * Props interface for the DetailsForm component
 */
interface DetailsFormProps {
  roleDefinitionIds: string[];
  conflictEffect?: string;
  operations: Operation[];
  onUpdate: (details: Details) => void;
}

/**
 * Simple condition group structure
 */
export interface ConditionGroup {
  not?: boolean;              // Whether to negate the conditions
  anyOf: Condition[];        // List of conditions (OR relationship)
}

/**
 * Structure for policy rule conditions
 */
export interface PolicyRuleIf {
  allOf?: Condition[];
  anyOf?: Condition[];
  not?: PolicyRuleIf;
}

