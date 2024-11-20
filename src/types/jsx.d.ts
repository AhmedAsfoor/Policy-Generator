/**
 * Type Declarations for External Dependencies
 * 
 * This file provides TypeScript type declarations for external packages and components
 * that don't include their own type definitions or need custom type augmentation.
 * 
 * Currently includes:
 * - Monaco Editor type declarations (@monaco-editor/react)
 * 
 * These declarations enable proper TypeScript support and IDE features like
 * autocompletion and type checking when using these external components.
 */

import React from 'react';

/**
 * Type declarations for @monaco-editor/react package
 * 
 * These declarations provide TypeScript support for the Monaco editor component,
 * which is used for:
 * - JSON policy preview and editing
 * - Syntax highlighting
 * - Code validation
 * - Rich editing features
 */
declare module '@monaco-editor/react' {
  /**
   * Props interface for the Monaco Editor component
   * @property height - Editor height in pixels or CSS string value
   * @property defaultLanguage - Language for syntax highlighting (e.g., 'json')
   * @property value - Content to display in the editor
   * @property options - Configuration options for the editor
   * @property onMount - Callback when editor is mounted to the DOM
   */
  interface EditorProps {
    height?: string | number;      // Editor height (px or string value)
    defaultLanguage?: string;      // Default language for syntax highlighting
    value?: string;               // Content to display in the editor
    options?: any;                // Monaco editor options
    onMount?: (editor: any) => void; // Callback when editor is mounted
  }
  
  /**
   * Monaco Editor React component
   * Provides a rich code editing experience with features like:
   * - Syntax highlighting
   * - Code completion
   * - Error detection
   * - Format on paste/type
   */
  const Editor: React.FC<EditorProps>;
  export default Editor;
}

// Export empty object to make this a module
export {};
