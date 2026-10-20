import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 ${
            error
              ? "border-red-500 bg-red-50/40 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-200 focus:ring-[#5022C3]/20 focus:border-[#5022C3]"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
