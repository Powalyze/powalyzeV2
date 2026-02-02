import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 
        bg-white dark:bg-gray-800 
        border border-gray-300 dark:border-gray-600 
        rounded-lg
        text-sm text-gray-900 dark:text-gray-100
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    />
  );
}
