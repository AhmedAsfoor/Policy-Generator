import React from 'react';
import { AVAILABLE_OPERATORS } from '../../../constants/policy';
import '../../../styles/PolicyEditor.css';

/**
 * Props interface for the OperatorSelect component
 * @property value - Currently selected operator value
 * @property onChange - Callback function triggered when a new operator is selected
 */
interface OperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * OperatorSelect component for choosing logical operators
 * 
 * This component renders a dropdown select element that allows users to choose
 * from available logical operators (defined in AVAILABLE_OPERATORS constant).
 * It's used within the Condition Editor to set the operator for condition statements.
 * 
 * @example
 * <OperatorSelect
 *   value={currentOperator}
 *   onChange={handleOperatorChange}
 * />
 */
export const OperatorSelect: React.FC<OperatorSelectProps> = ({ value, onChange }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="condition-operator-select"
  >
    {AVAILABLE_OPERATORS.map(op => (
      <option key={op} value={op}>{op}</option>
    ))}
  </select>
); 