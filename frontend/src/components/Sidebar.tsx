import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BookMarked,
  Library,
  LayoutDashboard,
  History,
  CalendarClock,
  Tags } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
export function Sidebar() {
  const { isAdmin } = useAuth();
  const adminLinks = [
  {
    to: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Tableau de bord'
  },
  {
    to: '/admin/users',
    icon: Users,
    label: 'Membres'
  },
  {
    to: '/admin/books',
    icon: BookOpen,
    label: 'Livres'
  },
  {
    to: '/admin/categories',
    icon: Tags,
    label: 'Catégories'
  },
  {
    to: '/admin/loans',
    icon: History,
    label: 'Emprunts'
  },
  {
    to: '/admin/reservations',
    icon: CalendarClock,
    label: 'Réservations'
  }];

  const memberLinks = [
  {
    to: '/member/dashboard',
    icon: LayoutDashboard,
    label: 'Mon espace'
  },
  {
    to: '/member/catalog',
    icon: Library,
    label: 'Catalogue'
  },
  {
    to: '/member/loans',
    icon: BookMarked,
    label: 'Mes emprunts'
  },
  {
    to: '/member/reservations',
    icon: CalendarClock,
    label: 'Mes réservations'
  }];

  const links = isAdmin ? adminLinks : memberLinks;
  return (
    <aside className="w-64 bg-library-navy text-slate-300 flex flex-col h-full border-r border-library-indigo/30">
      <div className="h-16 flex items-center px-6 border-b border-library-indigo/30 bg-library-navy/50">
        <img src="/favicon.svg" alt="Bibli'Net" className="h-10 w-10 mr-3" />
        <span className="text-xl font-serif font-bold text-white tracking-wide">
          Bibli'Net
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu Principal
        </div>
        <nav className="space-y-1">
          {links.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
            `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-library-indigo/40 text-white' : 'hover:bg-library-indigo/20 hover:text-white'}`
            }>
            
              <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {link.label}
            </NavLink>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-library-indigo/30 bg-library-navy/30">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-library-indigo flex items-center justify-center text-white font-bold text-sm">
            {isAdmin ? 'A' : 'M'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {isAdmin ? 'Espace Admin' : 'Espace Membre'}
            </p>
          </div>
        </div>
      </div>
    </aside>);

}