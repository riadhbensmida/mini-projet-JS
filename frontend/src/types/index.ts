export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Admin extends User {
  role: 'admin';
  employee_id: string;
  department: string;
  permissions: string[];
  access_level: number;
}

export interface Member extends User {
  role: 'member';
  member_number: string;
  totalPenalty: number;
  max_loans: number;
  birth_date: string;
  address: string;
  city: string;
  postal_code: string;
  membership_expiry: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_id: string | null;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publication_year: number;
  category_id: string;
  cover: string;
  description: string;
  total_copies: number;
  available_copies: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  book_id: string;
  user_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  penalty_amount: number;
  penalty_paid: boolean;
  payment_date: string | null;
  status: 'active' | 'returned' | 'overdue';
  notes: string;
}

export interface Reservation {
  id: string;
  book_id: string;
  user_id: string;
  reservation_date: string;
  expiry_date: string;
  status: 'pending' | 'notified' | 'converted' | 'cancelled' | 'expired';
  notified: boolean;
}