/**
 * PolicyEditor Component
 * 
 * This is the main component for creating and editing Azure Policies. It provides
 * a complete interface for policy management, including:
 * - Basic policy information (name, description, etc.)
 * - Condition configuration with logical operators
 * - Parameter management
 * - Policy effect settings
 * - Live JSON preview
 * - Resizable split view
 */

import React from 'react';
import { useParameters, usePolicyEditorState, useEditorLayout } from '.';
import { BasicInfoTab } from './components/BasicInfoTab';
import { ConditionsTab } from './components/ConditionsTab';
import { ParametersTab } from './components/ParametersTab';
import { DetailsTab } from './components/DetailsTab';
import { TabNavigation } from './components/TabNavigation';
import { ResizeHandle } from './components/ResizeHandle';
import { PreviewSection } from './components/PreviewSection';
import '../../styles/PolicyEditor.css';

/**
 * PolicyEditor Component
 * 
 * Provides a comprehensive interface for Azure Policy creation and editing.
 * Uses custom hooks for state management and layout control.
 * 
 * @example
 * <PolicyEditor />
 */
const PolicyEditor: React.FC = () => {
  // Initialize policy state management
  const {
    policy,                    // Current policy state
    selectedEffect,            // Selected policy effect
    activeTab,                // Currently active tab
    setActiveTab,             // Tab selection handler
    handleDisplayNameChange,   // Display name update handler
    handleDescriptionChange,   // Description update handler
    handleCategoryChange,      // Category update handler
    handleModeChange,         // Mode update handler
    handleEffectChange,       // Effect update handler
    handleEditorChange,       // JSON editor update handler
    handleUpdateConditions,    // Conditions update handler
    handleToggleGroupType,    // Group type toggle handler
    handleToggleNot,          // NOT operator toggle handler
    handleUpdateDetails,      // Details update handler
    handleUpdateParameter,     // Parameter update handler
    handleRemoveParameter: removeParameterFromPolicy  // Parameter removal handler
  } = usePolicyEditorState();

  // Initialize layout management
  const {
    isDragging,               // Resize drag state
    splitPosition,            // Split position percentage
    editorRef,                // Reference to editor container
    handleMouseDown           // Resize initiation handler
  } = useEditorLayout();

  // Initialize parameter management
  const {
    parameterForm,            // Parameter form state
    editingParameter,         // Currently editing parameter
    nameError,                // Parameter name validation error
    allowedValuesError,       // Allowed values validation error
    defaultValueError,        // Default value validation error
    handleParameterFormChange, // Form field update handler
    handleAddParameter,       // Parameter addition handler
    handleEditParameter       // Parameter edit handler
  } = useParameters(policy.properties.parameters);

  return (
    <div className="policy-editor" ref={editorRef}>
      {/* Main editor section */}
      <div className="conditions-section" style={{ flex: `0 0 ${splitPosition}%` }}>
        {/* Tab navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          selectedEffect={selectedEffect}
        />

        {/* Basic Info Tab */}
        {activeTab === 'basicInfo' && (
          <BasicInfoTab
            policy={policy}
            selectedEffect={selectedEffect}
            onDisplayNameChange={handleDisplayNameChange}
            onDescriptionChange={handleDescriptionChange}
            onCategoryChange={handleCategoryChange}
            onModeChange={handleModeChange}
            onEffectChange={handleEffectChange}
          />
        )}

        {/* Conditions Tab */}
        {activeTab === 'conditions' && (
          <ConditionsTab
            policy={policy}
            onUpdateConditions={handleUpdateConditions}
            onToggleGroupType={handleToggleGroupType}
            onToggleNot={handleToggleNot}
          />
        )}

        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <ParametersTab
            policy={policy}
            parameterForm={parameterForm}
            editingParameter={editingParameter}
            nameError={nameError}
            allowedValuesError={allowedValuesError}
            defaultValueError={defaultValueError}
            onParameterFormChange={handleParameterFormChange}
            onAddParameter={(e) => handleAddParameter(e, handleUpdateParameter)}
            onEditParameter={handleEditParameter}
            onRemoveParameter={removeParameterFromPolicy}
          />
        )}

        {/* Details Tab - only shown for modify effect */}
        {activeTab === 'details' && selectedEffect.toLowerCase() === 'modify' && (
          <DetailsTab
            policy={policy}
            onUpdateDetails={handleUpdateDetails}
          />
        )}
      </div>

      {/* Resize handle */}
      <ResizeHandle 
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
      />

      {/* JSON preview section */}
      <PreviewSection 
        policy={policy}
        splitPosition={splitPosition}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default PolicyEditor;
