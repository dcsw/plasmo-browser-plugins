import React, { useState } from 'react';
import { CiSettings } from "react-icons/ci"

interface ExpanderButtonProps {
  children?: React.ReactNode;
  className?: string;
  summary?: string;
}

const ExpanderButton = ({ children, className, summary = "Expand" }: ExpanderButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    setIsExpanded(e.target.open);
  };

  return (
    <details className={className} onToggle={handleToggle}>

      <summary className="expander-button">
        <span>{summary}</span>
        <CiSettings
          alt={summary}
          className={`icon ${isExpanded ? 'expanded' : ''}`}
        />
      </summary>
      <div className="expanded-content">
        {children}
      </div>
    </details>
  );
};

export default ExpanderButton;
