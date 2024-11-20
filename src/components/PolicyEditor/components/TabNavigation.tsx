import React from 'react';
import { TabType } from '../../../types/policyEditor';

/**
 * Props interface for the TabNavigation component
 * @property activeTab - Currently selected tab
 * @property setActiveTab - Callback function to change the active tab
 * @property selectedEffect - Currently selected policy effect
 */
interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedEffect: string;
}

/**
 * TabNavigation component for managing policy editor tabs
 * 
 * This component provides navigation between different sections of the policy editor:
 * - Basic Info: General policy information and settings
 * - Conditions: Policy condition configuration
 * - Parameters: Policy parameter management
 * - Details: Additional policy details (only visible for 'modify' effect)
 * 
 * The component dynamically shows/hides the Details tab based on the selected effect.
 * 
 * @example
 * <TabNavigation
 *   activeTab="basicInfo"
 *   setActiveTab={handleTabChange}
 *   selectedEffect="modify"
 * />
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  selectedEffect
}) => {
  return (
    <div className="tabs">
      {/* Basic Info tab */}
      <button 
        className={`tab ${activeTab === 'basicInfo' ? 'active' : ''}`}
        onClick={() => setActiveTab('basicInfo')}
      >
        Basic Info
      </button>

      {/* Conditions tab */}
      <button 
        className={`tab ${activeTab === 'conditions' ? 'active' : ''}`}
        onClick={() => setActiveTab('conditions')}
      >
        Conditions
      </button>

      {/* Parameters tab */}
      <button 
        className={`tab ${activeTab === 'parameters' ? 'active' : ''}`}
        onClick={() => setActiveTab('parameters')}
      >
        Parameters
      </button>

      {/* Details tab - only shown for 'modify' effect */}
      {selectedEffect.toLowerCase() === 'modify' && (
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      )}
    </div>
  );
}; 