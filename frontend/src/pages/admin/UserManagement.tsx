import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';
import { Member } from '../../types';
import { MoreVertical, Edit2, Ban, CheckCircle, UserPlus } from 'lucide-react';
export function UserManagement() {
  const { state, updateUserStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const members = state.users.filter((u) => u.role === 'member') as Member[];
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.member_number.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-library-navy">
            Gestion des Membres
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez les inscriptions et les statuts des membres.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-library-amber hover:bg-library-amberLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-amber transition-colors">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Membre
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par nom, email ou numéro..."
            className="max-w-md" />

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">

                  Membre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">

                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">

                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">

                  Expiration
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredMembers.map((member) => {
                const isExpired =
                  new Date(member.membership_expiry) < new Date();
                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-library-indigo/10 flex items-center justify-center text-library-indigo font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {member.member_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {member.email}
                      </div>
                      <div className="text-sm text-slate-500">
                        {member.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          member.status === 'active' ? 'success' : 'danger'
                        }>

                        {member.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                      {member.totalPenalty > 0 &&
                        <Badge variant="warning" className="ml-2">
                          Dette: {member.totalPenalty} TND
                        </Badge>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${isExpired ? 'text-rose-600 font-medium' : 'text-slate-900'}`}>

                        {new Date(member.membership_expiry).toLocaleDateString(
                          'fr-FR'
                        )}
                      </div>
                      {isExpired &&
                        <div className="text-xs text-rose-500">Expiré</div>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            updateUserStatus(
                              member.id,
                              member.status === 'active' ?
                                'inactive' :
                                'active'
                            )
                          }
                          className={`p-1.5 rounded-md ${member.status === 'active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                          title={
                            member.status === 'active' ?
                              'Désactiver' :
                              'Activer'
                          }>

                          {member.status === 'active' ?
                            <Ban size={18} /> :

                            <CheckCircle size={18} />
                          }
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-library-indigo hover:bg-slate-50 rounded-md">
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
          {filteredMembers.length === 0 &&
            <div className="text-center py-12 text-slate-500">
              Aucun membre trouvé.
            </div>
          }
        </div>
      </div>
    </div>);

}