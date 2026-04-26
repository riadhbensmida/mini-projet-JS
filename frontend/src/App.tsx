import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { BookManagement } from './pages/admin/BookManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { LoanManagement } from './pages/admin/LoanManagement';
import { ReservationManagement } from './pages/admin/ReservationManagement';
import { MemberDashboard } from './pages/member/MemberDashboard';
import { BookCatalog } from './pages/member/BookCatalog';
import { MyLoans } from './pages/member/MyLoans';
import { MyReservations } from './pages/member/MyReservations';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Welcome Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Area (using Layout) */}
          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route path="admin">
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="books" element={<BookManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="loans" element={<LoanManagement />} />
              <Route path="reservations" element={<ReservationManagement />} />
            </Route>

            {/* Member Routes */}
            <Route path="member">
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="catalog" element={<BookCatalog />} />
              <Route path="loans" element={<MyLoans />} />
              <Route path="reservations" element={<MyReservations />} />
            </Route>
          </Route>

          {/* Catch all - Redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}