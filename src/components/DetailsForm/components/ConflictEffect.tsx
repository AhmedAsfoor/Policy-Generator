import React from 'react';
import { ConflictEffectProps } from '../types';

/**
 * ConflictEffect component for managing policy conflict resolution
 * 
 * This component provides a dropdown interface for selecting how policy conflicts
 * should be handled. It supports three modes:
 * - audit: Log conflicts but don't enforce
 * - deny: Block conflicting operations
 * - disabled: Ignore conflicts
 * 
 * @example
 * <ConflictEffect
 *   conflictEffect="audit"
 *   onUpdateEffect={handleEffectChange}
 * />
 */
export const ConflictEffect: React.FC<ConflictEffectProps> = ({
  conflictEffect,
  onUpdateEffect
}) => {
  return (
    <div className="form-group">
      <label>Conflict Effect</label>
      <select
        value={conflictEffect || ''}
        onChange={(e) => {
          if (e.target.value) {
            onUpdateEffect(e.target.value);
          } else {
            onUpdateEffect(undefined);
          }
        }}
      >
        <option value="">Select Effect</option>
        <option value="audit">Audit</option>
        <option value="deny">Deny</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
}; 