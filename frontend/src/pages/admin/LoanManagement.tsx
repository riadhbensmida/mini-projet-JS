import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Download, CheckCircle, Clock } from 'lucide-react';
export function LoanManagement() {
  const { state, returnBook, payPenalty } = useAuth();
  const [filter, setFilter] = useState<
    'all' | 'active' | 'overdue' | 'returned'>(
    'all');
  const filteredLoans = state.loans.
  filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  }).
  sort(
    (a, b) =>
    new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime()
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-library-navy">
            Gestion des Emprunts
          </h1>
          <p className="text-slate-500 mt-1">
            Suivez les emprunts et gérez les retards.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-indigo transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {['all', 'active', 'overdue', 'returned'].map((tab) =>
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${filter === tab ? 'border-library-amber text-library-amber' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}>
              
                {tab === 'all' ?
              'Tous' :
              tab === 'active' ?
              'En cours' :
              tab === 'overdue' ?
              'En retard' :
              'Retournés'}
              </button>
            )}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Livre / Membre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Dates
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Pénalité
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredLoans.map((loan) => {
                const book = state.books.find((b) => b.id === loan.book_id);
                const user = state.users.find((u) => u.id === loan.user_id);
                return (
                  <tr
                    key={loan.id}
                    className="hover:bg-slate-50 transition-colors">
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {book?.title}
                      </div>
                      <div className="text-sm text-slate-500">{user?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        Du:{' '}
                        {new Date(loan.borrow_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div
                        className={`text-sm ${loan.status === 'overdue' ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                        
                        Au:{' '}
                        {new Date(loan.due_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                        loan.status === 'active' ?
                        'success' :
                        loan.status === 'overdue' ?
                        'danger' :
                        'neutral'
                        }>
                        
                        {loan.status === 'active' ?
                        'En cours' :
                        loan.status === 'overdue' ?
                        'En retard' :
                        'Retourné'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.penalty_amount > 0 ?
                      <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-rose-600">
                            {loan.penalty_amount} TND
                          </span>
                          <Badge
                          variant={loan.penalty_paid ? 'success' : 'warning'}
                          className="mt-1 text-[10px]">
                          
                            {loan.penalty_paid ? 'Payée' : 'Non payée'}
                          </Badge>
                        </div> :

                      <span className="text-sm text-slate-500">-</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {loan.status !== 'returned' &&
                        <button
                          onClick={() => returnBook(loan.id)}
                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors">
                          
                            Retourner
                          </button>
                        }
                        {loan.penalty_amount > 0 && !loan.penalty_paid &&
                        <button
                          onClick={() => payPenalty(loan.id)}
                          className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors">
                          
                            Valider paiement
                          </button>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
          {filteredLoans.length === 0 &&
          <div className="text-center py-12 text-slate-500">
              Aucun emprunt trouvé.
            </div>
          }
        </div>
      </div>
    </div>);

}