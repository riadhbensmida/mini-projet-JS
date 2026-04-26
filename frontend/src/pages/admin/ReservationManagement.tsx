import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { BookUp, XCircle } from 'lucide-react';
export function ReservationManagement() {
  const { state, convertReservationToLoan, cancelReservation } = useAuth();
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'converted' | 'cancelled' | 'expired'>(
    'pending');
  const filteredRes = state.reservations.
  filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  }).
  sort(
    (a, b) =>
    new Date(b.reservation_date).getTime() -
    new Date(a.reservation_date).getTime()
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Réservations
        </h1>
        <p className="text-slate-500 mt-1">
          Gérez les demandes de réservation des membres.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav
            className="-mb-px flex space-x-8 px-6 overflow-x-auto"
            aria-label="Tabs">
            
            {['pending', 'all', 'converted', 'cancelled', 'expired'].map(
              (tab) =>
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${filter === tab ? 'border-library-amber text-library-amber' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}>
                
                  {tab === 'pending' ?
                'En attente' :
                tab === 'all' ?
                'Toutes' :
                tab === 'converted' ?
                'Converties' :
                tab === 'cancelled' ?
                'Annulées' :
                'Expirées'}
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
                  
                  Livre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Membre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Date de demande
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  
                  Statut
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredRes.map((res) => {
                const book = state.books.find((b) => b.id === res.book_id);
                const user = state.users.find((u) => u.id === res.user_id);
                const isAvailable = book && book.available_copies > 0;
                return (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-50 transition-colors">
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {book?.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isAvailable ?
                        <span className="text-emerald-600 font-medium">
                            Disponible
                          </span> :

                        <span className="text-rose-600">Indisponible</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user?.name}</div>
                      <div className="text-xs text-slate-500">
                        {user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(res.reservation_date).toLocaleDateString(
                          'fr-FR'
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Expire le:{' '}
                        {new Date(res.expiry_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                        res.status === 'pending' ?
                        'warning' :
                        res.status === 'converted' ?
                        'success' :
                        res.status === 'expired' ?
                        'neutral' :
                        'danger'
                        }>
                        
                        {res.status === 'pending' ?
                        'En attente' :
                        res.status === 'converted' ?
                        'Convertie' :
                        res.status === 'expired' ?
                        'Expirée' :
                        'Annulée'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {res.status === 'pending' &&
                      <div className="flex items-center justify-end space-x-2">
                          <button
                          onClick={() => convertReservationToLoan(res.id)}
                          disabled={!isAvailable}
                          className={`px-2 py-1 rounded transition-colors flex items-center ${isAvailable ? 'text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 cursor-not-allowed'}`}
                          title={
                          !isAvailable ?
                          'Livre indisponible' :
                          'Convertir en emprunt'
                          }>
                          
                            <BookUp size={16} className="mr-1" />
                            Prêter
                          </button>
                          <button
                          onClick={() => cancelReservation(res.id)}
                          className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors flex items-center">
                          
                            <XCircle size={16} className="mr-1" />
                            Annuler
                          </button>
                        </div>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
          {filteredRes.length === 0 &&
          <div className="text-center py-12 text-slate-500">
              Aucune réservation trouvée.
            </div>
          }
        </div>
      </div>
    </div>);

}