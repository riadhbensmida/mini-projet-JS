import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Book, Category, Loan, Reservation } from '../types';
import { api } from '../services/api';

interface AppState {
  users: User[];
  books: Book[];
  categories: Category[];
  loans: Loan[];
  reservations: Reservation[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isMember: boolean;
  state: AppState;
  // Actions
  addBook: (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  borrowBook: (bookId: string, userId: string) => Promise<boolean>;
  returnBook: (loanId: string) => Promise<void>;
  extendLoan: (loanId: string) => Promise<void>;
  payPenalty: (loanId: string) => Promise<void>;
  reserveBook: (bookId: string, userId: string) => Promise<boolean>;
  cancelReservation: (reservationId: string) => Promise<void>;
  convertReservationToLoan: (reservationId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>({
    users: [],
    books: [],
    categories: [],
    loans: [],
    reservations: [],
  });

  // Initial data fetch
  const fetchData = async () => {
    try {
      const [users, books, categories, loans, reservations] = await Promise.all([
        api.users.getAll(),
        api.books.getAll(),
        api.categories.getAll(),
        api.loans.getAll(),
        api.reservations.getAll(),
      ]);
      setState({ users, books, categories, loans, reservations });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.auth.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
      fetchData();
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response.user) {
        setUser(response.user);
        await fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.auth.register({ name, email, password });
      if (response.user) {
        setUser(response.user);
        await fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member';

  // --- Actions mapped to API ---
  const addBook = async (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    await api.books.create(bookData);
    await fetchData();
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    await api.books.update(id, bookData);
    await fetchData();
  };

  const deleteBook = async (id: string) => {
    await api.books.delete(id);
    await fetchData();
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    await api.categories.create(categoryData);
    await fetchData();
  };

  const borrowBook = async (bookId: string, userId: string) => {
    try {
      await api.loans.borrow({ book_id: bookId, user_id: userId });
      await fetchData();
      return true;
    } catch (error) {
      console.error('Borrow error:', error);
      return false;
    }
  };

  const returnBook = async (loanId: string) => {
    await api.loans.return(loanId);
    await fetchData();
  };

  const extendLoan = async (loanId: string) => {
    await api.loans.extend(loanId);
    await fetchData();
  };

  const payPenalty = async (loanId: string) => {
    await api.loans.payPenalty(loanId);
    await fetchData();
  };

  const reserveBook = async (bookId: string, userId: string) => {
    try {
      await api.reservations.create({ book_id: bookId, user_id: userId });
      await fetchData();
      return true;
    } catch (error) {
      console.error('Reservation error:', error);
      return false;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    await api.reservations.cancel(reservationId);
    await fetchData();
  };

  const convertReservationToLoan = async (reservationId: string) => {
    await api.reservations.convert(reservationId);
    await fetchData();
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'inactive') => {
    await api.users.updateStatus(userId, status);
    await fetchData();
  };

  if (loading) {
    return <div className="min-h-screen bg-library-cream flex items-center justify-center font-serif text-2xl text-library-navy">Chargement...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin,
        isMember,
        state,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        borrowBook,
        returnBook,
        extendLoan,
        payPenalty,
        reserveBook,
        cancelReservation,
        convertReservationToLoan,
        updateUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};