/**
 * Validation Utilities
 * 
 * This file contains utility functions for validating various data formats
 * used throughout the application. Currently includes JSON array validation,
 * with potential for expansion to other validation needs.
 */

/**
 * Validates if a string is a valid JSON array
 * 
 * This function attempts to parse a string as JSON and checks if the
 * resulting value is an array. It's used primarily for validating:
 * - Parameter allowed values
 * - Array inputs in policy conditions
 * - Custom array configurations
 * 
 * @param str - String to validate as a JSON array
 * @returns boolean indicating if the string is a valid JSON array
 * 
 * @example
 * isValidJSONArray('["value1", "value2"]') // returns true
 * isValidJSONArray('{"key": "value"}')     // returns false
 * isValidJSONArray('invalid json')         // returns false
 */
export const isValidJSONArray = (str: string): boolean => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
}; 