import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center">
        <button className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-library-amber transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex items-center">
          <div className="text-right mr-3 hidden sm:block">
            <p className="text-sm font-medium text-slate-700">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-library-amber/20 text-library-amber flex items-center justify-center font-bold border border-library-amber/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>

        <button
          onClick={logout}
          className="ml-2 p-2 text-slate-400 hover:text-rose-500 transition-colors"
          title="Déconnexion">

          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>);

}