import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ title, subtitle, children, className = '', action }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 ${className}`}>
      {(title || action) && (
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2 bg-gray-50/30">
          <div>
            {title && <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-3.5 sm:p-6">
        {children}
      </div>
    </div>
  );
}
