import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'indigo' | 'amber' | 'emerald' | 'rose';
}
export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo'
}: StatsCardProps) {
  const colorStyles = {
    indigo: 'bg-library-indigo/10 text-library-indigo',
    amber: 'bg-library-amber/10 text-library-amber',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600'
  };
  return (
    <motion.div
      whileHover={{
        y: -2
      }}
      className="bg-white rounded-xl p-6 shadow-warm border border-slate-100">
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-library-navy">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend &&
      <div className="mt-4 flex items-center text-sm">
          <span
          className={`font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-400 ml-2">depuis le mois dernier</span>
        </div>
      }
    </motion.div>);

}