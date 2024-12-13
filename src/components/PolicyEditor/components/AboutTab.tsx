import React from 'react';

export const AboutTab: React.FC = () => {
  return (
    <div className="about-tab">
      <section className="about-section disclaimer">
        <h2>Disclaimer</h2>
        <p>
          This tool is an independent project and is not developed, endorsed, or supported by Microsoft. 
          Azure Policy Editor is a third-party tool designed to assist with Azure Policy creation, but it is not an official Microsoft product.
        </p>
      </section>

      <section className="about-section">
        <h2>About Azure Policy Editor</h2>
        <p>
          The Azure Policy Editor is a specialized tool designed to simplify the creation Azure Policies. It provides a user-friendly interface for defining Azure Policy components.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Visual Policy Creation:</strong> Create complex Azure policies without writing JSON directly.
          </li>
          <li>
            <strong>Effect Management:</strong> Easily configure policy effects.
          </li>
          <li>
            <strong>Condition Builder:</strong> Intuitive interface for building policy conditions.
          </li>
          <li>
            <strong>Parameter Management:</strong> Simplified parameter creation and configuration.
          </li>
          <li>
            <strong>Real-time Preview:</strong> See your policy JSON update in real-time as you make changes.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2>How to Use</h2>
        <ol>
          <li>Start by setting basic policy information (name, description, category)</li>
          <li>Choose the desired effect (Audit, Deny, or Modify), audit if not exist and deploy if not exist effects will be available in future updates.</li>
          <li>Define your policy conditions using the condition builder</li>
          <li>Configure any necessary parameters</li>
          <li>Review the generated policy JSON</li>
          <li>Copy and use the policy in your Azure environment</li>
        </ol>
      </section>
    </div>
  );
}; 