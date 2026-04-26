import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { XCircle, CalendarClock } from 'lucide-react';
export function MyReservations() {
  const { state, user, cancelReservation } = useAuth();
  if (!user) return null;
  const myReservations = state.reservations.
  filter((r) => r.user_id === user.id).
  sort(
    (a, b) =>
    new Date(b.reservation_date).getTime() -
    new Date(a.reservation_date).getTime()
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Mes Réservations
        </h1>
        <p className="text-slate-500 mt-1">
          Suivez l'état de vos demandes de réservation.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {myReservations.map((res) => {
              const book = state.books.find((b) => b.id === res.book_id);
              const isPending = res.status === 'pending';
              return (
                <div
                  key={res.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border border-slate-200 bg-white">
                  
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium text-slate-900">
                      {book?.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">
                      {book?.author}
                    </p>
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
                      'Convertie en emprunt' :
                      res.status === 'expired' ?
                      'Expirée' :
                      'Annulée'}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex flex-col sm:items-end">
                    <p className="text-sm text-slate-500 mb-1">
                      Demandé le{' '}
                      {new Date(res.reservation_date).toLocaleDateString(
                        'fr-FR'
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mb-3">
                      Expire le{' '}
                      {new Date(res.expiry_date).toLocaleDateString('fr-FR')}
                    </p>
                    {isPending &&
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="inline-flex items-center text-sm text-rose-600 hover:text-rose-800 font-medium">
                      
                        <XCircle size={16} className="mr-1" />
                        Annuler la réservation
                      </button>
                    }
                  </div>
                </div>);

            })}

            {myReservations.length === 0 &&
            <div className="text-center py-12 text-slate-500">
                <CalendarClock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>Vous n'avez aucune réservation.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}