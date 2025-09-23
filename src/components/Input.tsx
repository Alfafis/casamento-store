import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          {...props}
          className={`w-full border border-sage/20 rounded-soft p-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed ${className} ${
            error ? 'border-red-500' : ''
          }`}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
