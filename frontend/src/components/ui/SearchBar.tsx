import React from 'react';
import { Search } from 'lucide-react';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher...',
  className = ''
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-library-amber focus:border-library-amber sm:text-sm transition-colors"
        placeholder={placeholder} />
      
    </div>);

}