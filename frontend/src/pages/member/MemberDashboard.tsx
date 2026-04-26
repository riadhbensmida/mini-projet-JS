import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookMarked, History, AlertCircle, Library } from 'lucide-react';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export function MemberDashboard() {
  const { user, state } = useAuth();
  if (!user) return null;
  const myLoans = state.loans.filter((l) => l.user_id === user.id);
  const activeLoans = myLoans.filter((l) => l.status === 'active');
  const overdueLoans = myLoans.filter((l) => l.status === 'overdue');
  const returnedLoans = myLoans.filter((l) => l.status === 'returned');
  const totalPenalty = myLoans.reduce(
    (acc, loan) => acc + (loan.penalty_paid ? 0 : loan.penalty_amount),
    0
  );
  const dueSoonLoans = activeLoans.filter((l) => {
    const daysUntilDue = Math.ceil(
      (new Date(l.due_date).getTime() - new Date().getTime()) / (
      1000 * 3600 * 24)
    );
    return daysUntilDue >= 0 && daysUntilDue <= 3;
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Bonjour, {user.name}
        </h1>
        <p className="text-slate-500 mt-1">
          Bienvenue dans votre espace lecteur.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Emprunts en cours"
          value={activeLoans.length + overdueLoans.length}
          icon={BookMarked}
          color="indigo" />
        
        <StatsCard
          title="Livres lus"
          value={returnedLoans.length}
          icon={History}
          color="emerald" />
        
        <StatsCard
          title="Pénalités dues"
          value={`${totalPenalty} TND`}
          icon={AlertCircle}
          color={totalPenalty > 0 ? 'rose' : 'neutral'} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Due Soon Alerts */}
          {(dueSoonLoans.length > 0 || overdueLoans.length > 0) &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="bg-rose-50 rounded-xl p-6 border border-rose-100">
            
              <h3 className="text-lg font-medium text-rose-900 flex items-center mb-4">
                <AlertCircle className="w-5 h-5 mr-2 text-rose-500" />
                Attention requise
              </h3>
              <div className="space-y-3">
                {overdueLoans.map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                return (
                  <div
                    key={loan.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-rose-100 flex justify-between items-center">
                    
                      <div>
                        <p className="font-medium text-slate-900">
                          {book?.title}
                        </p>
                        <p className="text-sm text-rose-600 mt-0.5">
                          En retard depuis le{' '}
                          {new Date(loan.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge variant="danger">
                        Pénalité: {loan.penalty_amount} TND
                      </Badge>
                    </div>);

              })}
                {dueSoonLoans.map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                const daysUntilDue = Math.ceil(
                  (new Date(loan.due_date).getTime() - new Date().getTime()) / (
                  1000 * 3600 * 24)
                );
                return (
                  <div
                    key={loan.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex justify-between items-center">
                    
                      <div>
                        <p className="font-medium text-slate-900">
                          {book?.title}
                        </p>
                        <p className="text-sm text-amber-600 mt-0.5">
                          À rendre dans {daysUntilDue} jour
                          {daysUntilDue > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Link
                      to="/member/loans"
                      className="text-sm font-medium text-library-indigo hover:text-library-indigo/80">
                      
                        Gérer
                      </Link>
                    </div>);

              })}
              </div>
            </motion.div>
          }

          {/* Current Loans */}
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
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-medium text-library-navy flex items-center">
                <BookMarked className="w-5 h-5 mr-2 text-slate-400" />
                Mes emprunts en cours
              </h3>
              <Link
                to="/member/loans"
                className="text-sm text-library-amber hover:text-library-amberLight font-medium">
                
                Voir tout
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {activeLoans.slice(0, 3).map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                return (
                  <div key={loan.id} className="px-6 py-4 flex items-center">
                    <div className="h-16 w-12 flex-shrink-0 bg-slate-100 rounded overflow-hidden border border-slate-200">
                      {book?.cover &&
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover" />

                      }
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {book?.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {book?.author}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        Retour:{' '}
                        {new Date(loan.due_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>);

              })}
              {activeLoans.length === 0 &&
              <div className="px-6 py-8 text-center text-slate-500">
                  Vous n'avez aucun emprunt en cours.
                </div>
              }
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Link
            to="/member/catalog"
            className="block bg-library-navy text-white rounded-xl p-6 shadow-warm hover:bg-library-indigo transition-colors group">
            
            <Library className="w-8 h-8 text-library-amber mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-medium mb-1">Explorer le catalogue</h3>
            <p className="text-sm text-slate-300">
              Découvrez de nouveaux livres à emprunter.
            </p>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-warm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">
              Ma Carte
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Numéro</span>
                <span className="font-medium text-slate-900">
                  {(user as any).member_number}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Statut</span>
                <Badge
                  variant={user.status === 'active' ? 'success' : 'danger'}>
                  
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Expiration</span>
                <span className="font-medium text-slate-900">
                  {new Date((user as any).membership_expiry).toLocaleDateString(
                    'fr-FR'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}