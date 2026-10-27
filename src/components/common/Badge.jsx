import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'neutral', // 'demo' | 'sage' | 'espresso' | 'neutral' | 'outline'
  showDot = false,
  className = '',
  ...rest
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...rest}>
      {showDot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
