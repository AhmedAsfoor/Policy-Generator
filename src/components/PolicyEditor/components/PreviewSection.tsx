import React from 'react';
import Editor from "@monaco-editor/react";
import { PolicyTemplate } from '../../../types/policy';

/**
 * Props interface for the PreviewSection component
 * @property policy - The current policy template being edited
 * @property splitPosition - Position of the split between editor and preview (percentage)
 * @property onEditorChange - Callback for handling manual edits in the preview
 */
interface PreviewSectionProps {
  policy: PolicyTemplate;
  splitPosition: number;
  onEditorChange: (value: string | undefined) => void;
}

/**
 * PreviewSection component for displaying policy JSON preview
 * 
 * This component provides a read-only Monaco editor view of the policy JSON,
 * allowing users to:
 * - View the complete policy structure
 * - See real-time updates as they make changes
 * - Copy policy JSON
 * - Verify policy formatting
 * 
 * The preview is automatically formatted and updates in real-time as changes
 * are made in the policy editor.
 * 
 * @example
 * <PreviewSection
 *   policy={currentPolicy}
 *   splitPosition={70}
 *   onEditorChange={handlePreviewChange}
 * />
 */
export const PreviewSection: React.FC<PreviewSectionProps> = ({
  policy,
  splitPosition,
  onEditorChange
}) => {
  // Configuration options for Monaco editor
  const editorOptions = {
    minimap: { enabled: false },      // Disable minimap for cleaner UI
    readOnly: true,                   // Prevent direct editing
    scrollBeyondLastLine: false,      // Prevent scrolling past content
    wordWrap: "on" as const,          // Enable word wrapping
    formatOnPaste: true,              // Format pasted content
    formatOnType: true,               // Format as user types
    automaticLayout: true,            // Automatically adjust layout
    tabSize: 2                        // Set indentation size
  };

  return (
    <div className="preview-section" style={{ flex: `0 0 ${100 - splitPosition}%` }}>
      <h3>Preview</h3>
      <div className="monaco-editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={JSON.stringify(policy, null, 2)}  // Pretty print JSON with 2-space indentation
          onChange={onEditorChange}
          options={editorOptions}
        />
      </div>
    </div>
  );
}; 