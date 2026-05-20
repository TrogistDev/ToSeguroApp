// apps/web/src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputableProps> = ({ className, ...props }) => (
  <input 
    className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
    {...props}
  />
);