import React, { useState } from 'react';
import gearIcon from '../assets/gear.svg';  // Adjust this path as needed

const ExpanderButton = ({ children, summary = "Expand" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = (e) => {
        setIsExpanded(e.target.open);
    };

    return (
    <details onToggle={handleToggle}>
    
      <summary className="expander-button">
        <span>{summary}</span>
        <img 
          src={gearIcon} 
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
