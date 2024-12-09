/**
 * This file contains constant values and configurations for Azure Policy management.
 * It provides:
 * 
 * 1. Field Definitions
 *    - Common fields that appear in resources
 *    - Available fields from Azure Policy aliases
 *    - Array fields for collection operations
 * 
 * 2. Operator Configurations
 *    - Available operators for conditions
 *    - Operator placeholders for UI hints
 *    - Special operators for count conditions
 * 
 * 3. Default Templates
 *    - Initial policy template structure
 *    - Default values for new policies
 */

// Import the aliases
import AzPolicyAliases from '../data/AzPolicyAliases.json';
import { PolicyTemplate } from '../types/policy';

interface GroupedField {
  display: string;
  value: string;
}

interface AliasGroup {
  resourceType: string;
  fields: GroupedField[];
}

/**
 * Common fields that appear at the top of field lists
 */
export const COMMON_FIELDS = [
  "name",
  "fullName",
  "kind",
  "type",
  "location",
  "id",
  "identity.type",
  "tags"
].map(field => ({ display: field, value: field }));

/**
 * Groups aliases by their resource type
 * @param aliases The Azure Policy aliases object
 * @returns An array of fields grouped by resource type
 */
const groupAliasByResourceType = (aliases: typeof AzPolicyAliases): AliasGroup[] => {
  const grouped = new Map<string, GroupedField[]>();
  
  Object.values(aliases).forEach(item => {
    const aliases = Array.isArray(item.Aliases) ? item.Aliases : [item.Aliases];
    const resourceType = item.ResourceType;
    
    if (!grouped.has(resourceType)) {
      grouped.set(resourceType, []);
    }
    
    aliases.forEach((alias: string) => {
      grouped.get(resourceType)?.push({
        display: alias,
        value: alias
      });
    });
  });
  
  return Array.from(grouped.entries())
    .map(([resourceType, fields]) => ({
      resourceType,
      fields: fields.sort((a, b) => a.display.localeCompare(b.display))
    }))
    .sort((a, b) => a.resourceType.localeCompare(b.resourceType));
};

/**
 * Grouped aliases by resource type
 * Contains all Azure Policy aliases organized by their resource type
 */
export const GROUPED_ALIASES = groupAliasByResourceType(AzPolicyAliases);

/**
 * Available fields for policy conditions
 * Combines common fields with Azure Policy aliases
 */
export const AVAILABLE_FIELDS = [
  // Add common fields first
  ...COMMON_FIELDS,
  // Add all fields from grouped aliases
  ...GROUPED_ALIASES.flatMap(group => group.fields)
] as const;

/**
 * Available operators for simple conditions
 * These operators can be used in policy condition statements
 */
export const AVAILABLE_OPERATORS = [
  "equals",
  "notEquals",
  "like",
  "notLike",
  "match",
  "matchInsensitively",
  "notMatch",
  "notMatchInsensitively",
  "contains",
  "notContains",
  "in",
  "notIn",
  "containsKey",
  "notContainsKey",
  "less",
  "lessOrEquals",
  "greater",
  "greaterOrEquals",
  "exists"
] as const;

/**
 * Operator placeholders for UI input fields
 * Provides helpful hints about the expected value format for each operator
 */
export const OPERATOR_PLACEHOLDERS = {
  equals: "stringValue",
  notEquals: "stringValue",
  like: "stringValue",
  notLike: "stringValue",
  match: "stringValue",
  matchInsensitively: "stringValue",
  notMatch: "stringValue",
  notMatchInsensitively: "stringValue",
  contains: "stringValue",
  notContains: "stringValue",
  in: '["stringValue1","stringValue2"]',
  notIn: '["stringValue1","stringValue2"]',
  containsKey: "keyName",
  notContainsKey: "keyName",
  less: "dateValue | stringValue | intValue",
  lessOrEquals: "dateValue | stringValue | intValue",
  greater: "dateValue | stringValue | intValue",
  greaterOrEquals: "dateValue | stringValue | intValue",
  exists: "bool"
} as const;

/**
 * Available operators for count conditions
 * These operators are specifically for use with count-based conditions
 */
export const COUNT_OPERATORS = [
  'greater',
  'less', 
  'equals'
] as const;

/**
 * Default policy template
 * Provides the initial structure for new policies
 */
export const initialPolicyTemplate: PolicyTemplate = {
  properties: {
    displayName: '',
    description: '',
    policyType: 'Custom',
    mode: 'All',
    metadata: {
      version: '1.0.0',
      category: '',
      preview: false
    },
    version: '1.0.0',
    parameters: {
      effect: {
        type: 'String',
        metadata: {
          displayName: 'Effect',
          description: 'The effect determines what happens when the policy rule is evaluated to match'
        },
        allowedValues: ['Audit', 'Deny', 'Disabled'],
        defaultValue: 'Audit'
      }
    },
    policyRule: {
      if: {
        allOf: []
      },
      then: {
        effect: "[parameters('effect')]"
      }
    }
  }
};

/**
 * Type definitions for operators and fields
 * These types are used for type checking throughout the application
 */
export type SimpleOperator = typeof AVAILABLE_OPERATORS[number];
export type CountOperator = typeof COUNT_OPERATORS[number];
export type AvailableField = typeof AVAILABLE_FIELDS[number];

/**
 * Array fields for collection operations
 * These fields are specifically for use with count conditions
 */
export const ARRAY_FIELDS = AVAILABLE_FIELDS
  .filter(field => field.value.includes('[*]'))
  .sort((a, b) => a.display.localeCompare(b.display));
