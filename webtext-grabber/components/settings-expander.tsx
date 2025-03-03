import React, { useState } from 'react';
import { CiSettings } from "react-icons/ci"

interface ExpanderButtonProps {
  children?: React.ReactNode;
  className?: string;
  hover?: string;
  heading?: string;
  title?: string;
}

const ExpanderButton = ({ children, className, hover="Expand", heading="Heading", title="Settings" }: ExpanderButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => { setIsExpanded(e.target.open); };

  return (
    <details className={className} title={hover} onToggle={handleToggle} >
      <summary className="expander-button">
        <span>{heading}</span>
        <CiSettings className={`icon ${isExpanded ? 'expanded' : ''}`} />
      </summary>
      <div className="expanded-content">
        <span><h2>{title}</h2></span>
        {children}
      </div>
    </details>
  );
};

export default ExpanderButton;
