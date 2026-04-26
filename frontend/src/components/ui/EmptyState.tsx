import React from 'react';
import { BoxIcon } from 'lucide-react';
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-library-navy mb-1">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>);

}