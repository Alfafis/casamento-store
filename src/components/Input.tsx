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
          className={`w-full rounded-soft border border-sage/20 p-2 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-50 ${className} ${
            error ? 'border-red-500' : ''
          }`}
        />
        {error && (
          <span className="mt-1 block text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
