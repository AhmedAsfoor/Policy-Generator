import React, { useEffect } from 'react';
import PolicyEditor from './components/PolicyEditor/PolicyEditor';

/**
 * Root Application Component
 * 
 * This component serves as the entry point for the Azure Policy Editor application.
 * It renders the PolicyEditor component which provides a complete interface for:
 * - Creating and editing Azure Policies
 * - Managing policy conditions
 * - Configuring policy parameters
 * - Setting policy effects
 * - Previewing policy JSON
 * 
 * The application is designed to be a standalone policy editing tool that can be
 * integrated into larger Azure management interfaces.
 * 
 * @example
 * // In index.tsx:
 * ReactDOM.render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>,
 *   document.getElementById('root')
 * );
 */
function App() {
  useEffect(() => {
    document.title = 'Azure Policy Editor';
  }, []);

  return <PolicyEditor />;
}

export default App;
