import React, { Component, ErrorInfo } from 'react';

/**
 * Props interface for the ConditionEditorErrorBoundary component
 * @property children - React components to be wrapped by the error boundary
 * @property onError - Optional callback function to handle errors externally
 */
interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State interface for the ConditionEditorErrorBoundary component
 * @property hasError - Boolean flag indicating if an error has occurred
 * @property error - Optional Error object containing error details
 */
interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component for the Condition Editor
 * 
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * It's particularly useful for handling runtime errors in the Condition Editor component.
 */
export class ConditionEditorErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  /**
   * Static method called when an error occurs during rendering
   * Updates the state to indicate an error has occurred
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been caught
   * Logs the error and calls the optional onError callback
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ConditionEditor Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Renders either the error UI or the children components
   * If an error occurred, displays an error message with a retry button
   * Otherwise, renders the wrapped components normally
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="condition-editor-error">
          <h3>Something went wrong with the condition editor.</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 