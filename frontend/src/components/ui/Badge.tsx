import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  className?: string;
}
export function Badge({
  children,
  variant = 'neutral',
  className = ''
}: BadgeProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
    primary:
    'bg-library-indigo/10 text-library-indigo border-library-indigo/20'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      
      {children}
    </span>);

}