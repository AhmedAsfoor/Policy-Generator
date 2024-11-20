import React from 'react';
import { RoleSelectionProps } from '../types';
import controlPlaneRoles from '../../../data/control_plane_roles.json';

/**
 * RoleSelection component for managing Azure role assignments
 * 
 * This component provides an interface for selecting multiple Azure control plane roles,
 * featuring:
 * - Searchable role selection
 * - Multi-select capability
 * - Role removal
 * - Visual display of selected roles
 * 
 * @example
 * <RoleSelection
 *   roleDefinitionIds={selectedRoles}
 *   onUpdateRoles={handleRoleUpdate}
 * />
 */
export const RoleSelection: React.FC<RoleSelectionProps> = ({
  roleDefinitionIds,
  onUpdateRoles
}) => {
  // State for search functionality
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  // Reference for handling clicks outside dropdown
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  /**
   * Effect to handle clicks outside the dropdown
   * Closes the dropdown when clicking outside
   */
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-group">
      <label>Role Definition IDs</label>
      
      {/* Role search and selection dropdown */}
      <div className="role-select-container" ref={dropdownRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          placeholder="Search and select roles..."
          className="role-search-input"
        />
        
        {/* Dropdown with filtered roles */}
        {isDropdownOpen && (
          <div className="role-dropdown">
            {controlPlaneRoles
              .filter(role => 
                role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(role => (
                <div key={role.roleId} className="role-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={roleDefinitionIds.includes(role.roleId)}
                      onChange={(e) => {
                        const newRoleIds = e.target.checked
                          ? [...roleDefinitionIds, role.roleId]
                          : roleDefinitionIds.filter(id => id !== role.roleId);
                        onUpdateRoles(newRoleIds);
                      }}
                    />
                    <span>{role.roleName}</span>
                  </label>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Display selected roles with remove option */}
      <div className="selected-roles">
        {roleDefinitionIds.map(roleId => {
          const role = controlPlaneRoles.find(r => r.roleId === roleId);
          return role ? (
            <div key={roleId} className="selected-role">
              <span>{role.roleName}</span>
              <button
                onClick={() => onUpdateRoles(roleDefinitionIds.filter(id => id !== roleId))}
                className="remove-role"
              >
                ×
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}; 