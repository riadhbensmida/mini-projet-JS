import React from 'react';
import { BookOpen, Users, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export function AdminDashboard() {
  const { state } = useAuth();
  const totalBooks = state.books.reduce(
    (acc, book) => acc + book.total_copies,
    0
  );
  const activeLoans = state.loans.filter((l) => l.status === 'active').length;
  const overdueLoans = state.loans.filter((l) => l.status === 'overdue').length;
  const activeMembers = state.users.filter(
    (u) => u.role === 'member' && u.status === 'active'
  ).length;
  const recentLoans = [...state.loans].
    sort(
      (a, b) =>
        new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime()
    ).
    slice(0, 5);
  const overdueList = state.loans.
    filter((l) => l.status === 'overdue').
    sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    ).
    slice(0, 5);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Tableau de bord
        </h1>
        <p className="text-slate-500 mt-1">
          Vue d'ensemble de l'activité de la bibliothèque.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Livres"
          value={totalBooks}
          icon={BookOpen}
          color="indigo"
        />

        <StatsCard
          title="Emprunts Actifs"
          value={activeLoans}
          icon={TrendingUp}
          color="emerald"
        />

        <StatsCard
          title="En Retard"
          value={overdueLoans}
          icon={AlertCircle}
          color="rose"
        />

        <StatsCard
          title="Membres Actifs"
          value={activeMembers}
          icon={Users}
          color="amber"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-medium text-library-navy flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" />
              Emprunts récents
            </h3>
            <Link
              to="/admin/loans"
              className="text-sm text-library-amber hover:text-library-amberLight font-medium">

              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLoans.map((loan) => {
              const book = state.books.find((b) => b.id === loan.book_id);
              const user = state.users.find((u) => u.id === loan.user_id);
              return (
                <div
                  key={loan.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {book?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      par {user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {new Date(loan.borrow_date).toLocaleDateString('fr-FR')}
                    </p>
                    <Badge
                      variant={
                        loan.status === 'active' ?
                          'success' :
                          loan.status === 'overdue' ?
                            'danger' :
                            'neutral'
                      }
                      className="mt-1">

                      {loan.status === 'active' ?
                        'En cours' :
                        loan.status === 'overdue' ?
                          'En retard' :
                          'Retourné'}
                    </Badge>
                  </div>
                </div>);

            })}
            {recentLoans.length === 0 &&
              <div className="px-6 py-8 text-center text-slate-500">
                Aucun emprunt récent.
              </div>
            }
          </div>
        </motion.div>

        {/* Overdue Alerts */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}
          className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
            <h3 className="text-lg font-medium text-rose-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-rose-500" />
              Alertes retards
            </h3>
            <Link
              to="/admin/loans"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium">

              Gérer
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {overdueList.map((loan) => {
              const book = state.books.find((b) => b.id === loan.book_id);
              const user = state.users.find((u) => u.id === loan.user_id);
              const daysOverdue = Math.floor(
                (new Date().getTime() - new Date(loan.due_date).getTime()) / (
                  1000 * 3600 * 24)
              );
              return (
                <div
                  key={loan.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {book?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {user?.name} • {user?.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-rose-600">
                      {daysOverdue} jours
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pénalité: {loan.penalty_amount} TND
                    </p>
                  </div>
                </div>);

            })}
            {overdueList.length === 0 &&
              <div className="px-6 py-8 text-center text-slate-500">
                Aucun emprunt en retard.
              </div>
            }
          </div>
        </motion.div>
      </div>
    </div>);

}