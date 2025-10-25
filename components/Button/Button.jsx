'use client';

import { Loader2 } from "lucide-react";

const Button = ({
  children,
  href,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Size variants
  const sizes = {
    small: 'px-3 py-1.5 text-sm rounded-lg',
    medium: 'px-6 py-3 text-base rounded-lg',
    large: 'px-8 py-4 text-lg rounded-xl',
  };

  // Color variants
  const variants = {
    primary: {
      className: 'bg-accent text-white hover:bg-blue-600 focus:ring-accent hover:scale-[1.02] shadow-lg hover:shadow-xl'
    },
    secondary: {
      className: 'bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-white focus:ring-accent hover:scale-[1.02] shadow-md hover:shadow-lg'
    },
    tertiary: {
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-accent hover:scale-[1.01] shadow-sm hover:shadow-md'
    },
    danger: {
      className: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 hover:scale-[1.02] shadow-lg hover:shadow-xl'
    },
    success: {
      className: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 hover:scale-[1.02] shadow-lg hover:shadow-xl'
    },
    ghost: {
      className: 'bg-transparent text-gray-500 hover:bg-gray-100 focus:ring-accent hover:scale-[1.01]'
    }
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const buttonClasses = `${baseClasses} ${currentSize} ${currentVariant.className} ${disabled ? 'bg-gray-400 text-gray-300' : ''} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </>
  );

  if (href) {
    // Filter out interactive event handlers for anchor tags
    const { onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, ...anchorProps } = props;

    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      aria-label={loading ? `${children} - Loading` : children}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
