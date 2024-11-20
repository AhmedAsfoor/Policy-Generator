import React from 'react';
import { COUNT_OPERATORS } from '../../../constants/policy';

/**
 * Props interface for the CountOperatorSelect component
 * @property value - Currently selected operator value
 * @property onChange - Callback function triggered when a new operator is selected
 */
interface CountOperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Mapping of operator values to their display names
 * Provides user-friendly labels for each count operator
 */
const operatorDisplayMap: Record<string, string> = {
  'greater': 'Greater than',
  'less': 'Less than',
  'equals': 'Equals'
};

/**
 * CountOperatorSelect component for selecting count condition operators
 * 
 * This component provides a dropdown select for count-specific operators
 * (greater than, less than, equals). It's specifically designed for use
 * in count conditions where we're comparing the count of items against
 * a numeric value.
 * 
 * @example
 * <CountOperatorSelect
 *   value="greater"
 *   onChange={handleOperatorChange}
 * />
 */
export const CountOperatorSelect: React.FC<CountOperatorSelectProps> = ({
  value,
  onChange
}) => {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="condition-operator-select"
    >
      {COUNT_OPERATORS.map(operator => (
        <option key={operator} value={operator}>
          {operatorDisplayMap[operator]}
        </option>
      ))}
    </select>
  );
}; 