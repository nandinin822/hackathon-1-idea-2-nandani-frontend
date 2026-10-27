import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'sage' | 'outline' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  className = '',
  onClick,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
      <span className="btn-text">{children}</span>
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
};

export default Button;
