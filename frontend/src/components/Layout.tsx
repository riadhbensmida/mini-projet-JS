import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
export function Layout() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen overflow-hidden bg-library-cream">
      <div className="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}