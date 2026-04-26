import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { AlertCircle, CheckCircle } from 'lucide-react';
export function MyLoans() {
  const { state, user, extendLoan } = useAuth();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  if (!user) return null;
  const myLoans = state.loans.filter((l) => l.user_id === user.id);
  const currentLoans = myLoans.filter(
    (l) => l.status === 'active' || l.status === 'overdue'
  );
  const pastLoans = myLoans.filter((l) => l.status === 'returned');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Mes Emprunts
        </h1>
        <p className="text-slate-500 mt-1">
          Gérez vos emprunts en cours et consultez votre historique.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('current')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'current' ? 'border-library-amber text-library-amber' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}>

              En cours ({currentLoans.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'history' ? 'border-library-amber text-library-amber' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}>

              Historique ({pastLoans.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'current' ?
            <div className="space-y-4">
              {currentLoans.map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                const daysUntilDue = Math.ceil(
                  (new Date(loan.due_date).getTime() - new Date().getTime()) / (
                    1000 * 3600 * 24)
                );
                const isOverdue = loan.status === 'overdue';
                return (
                  <div
                    key={loan.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border ${isOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200 bg-white'}`}>

                    <div className="h-20 w-14 flex-shrink-0 bg-slate-100 rounded overflow-hidden border border-slate-200 mr-4 hidden sm:block">
                      {book?.cover &&
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover" />

                      }
                    </div>
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="text-lg font-medium text-slate-900">
                        {book?.title}
                      </h3>
                      <p className="text-sm text-slate-500">{book?.author}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant={
                            isOverdue ?
                              'danger' :
                              daysUntilDue <= 3 ?
                                'warning' :
                                'success'
                          }>

                          {isOverdue ?
                            `En retard de ${Math.abs(daysUntilDue)} jours` :
                            `À rendre dans ${daysUntilDue} jour${daysUntilDue > 1 ? 's' : ''}`}
                        </Badge>
                        {loan.penalty_amount > 0 &&
                          <Badge variant="danger">
                            Pénalité: {loan.penalty_amount} TND
                          </Badge>
                        }
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto flex flex-col items-end gap-2">
                      <div className="text-sm text-slate-500">
                        <p>Emprunté le {new Date(loan.borrow_date).toLocaleDateString('fr-FR')}</p>
                        <p className={`font-medium ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                          Retour prévu: {new Date(loan.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {!isOverdue && loan.status === 'active' && (
                        <button
                          onClick={() => extendLoan(loan.id)}
                          className="bg-library-amber text-library-navy px-3 py-1 rounded-md text-sm font-medium hover:bg-library-amberLight transition-colors"
                        >
                          Prolonger (15 jours)
                        </button>
                      )}
                    </div>
                  </div>);

              })}
              {currentLoans.length === 0 &&
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
                  <p>Vous n'avez aucun emprunt en cours.</p>
                </div>
              }
            </div> :

            <div className="space-y-4">
              {pastLoans.map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                return (
                  <div
                    key={loan.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border border-slate-200 bg-slate-50/50">

                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="text-base font-medium text-slate-900">
                        {book?.title}
                      </h3>
                      <p className="text-sm text-slate-500">{book?.author}</p>
                      {loan.penalty_amount > 0 &&
                        <p className="text-xs text-rose-600 mt-1">
                          Pénalité payée: {loan.penalty_amount} TND
                        </p>
                      }
                    </div>
                    <div className="text-left sm:text-right text-sm text-slate-600">
                      <p>
                        Emprunté le{' '}
                        {new Date(loan.borrow_date).toLocaleDateString('fr-FR')}
                      </p>
                      <p>
                        Retourné le{' '}
                        {loan.return_date ?
                          new Date(loan.return_date).toLocaleDateString(
                            'fr-FR'
                          ) :
                          '-'}
                      </p>
                    </div>
                  </div>);

              })}
              {pastLoans.length === 0 &&
                <div className="text-center py-12 text-slate-500">
                  <p>Votre historique d'emprunt est vide.</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>);

}