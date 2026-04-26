import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { Book } from '../../types';

export function BookManagement() {
  const { state, addBook, updateBook, deleteBook } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    category_id: '',
    cover: '',
    description: '',
    total_copies: 1,
    available_copies: 1,
    location: ''
  });

  const filteredBooks = state.books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm);
    const matchesCategory =
      selectedCategory === 'all' || b.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publication_year: new Date().getFullYear(),
      category_id: state.categories[0]?.id || '',
      cover: '',
      description: '',
      total_copies: 1,
      available_copies: 1,
      location: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
      } else {
        await addBook(formData as any);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Erreur lors de l'enregistrement du livre.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      await deleteBook(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-library-navy">
            Gestion des Livres
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez le catalogue de la bibliothèque.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-library-amber hover:bg-library-amberLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-amber transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un livre
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par titre, auteur, ISBN..."
            className="flex-1" />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-library-amber focus:border-library-amber sm:text-sm rounded-lg border bg-white">

            <option value="all">Toutes les catégories</option>
            {state.categories.map((c) =>
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            )}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Livre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Disponibilité</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Emplacement</th>
                <th scope="col" className="relative px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBooks.map((book) => {
                const category = state.categories.find(c => c.id === book.category_id);
                return (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-12 flex-shrink-0 bg-slate-100 rounded overflow-hidden border border-slate-200 flex items-center justify-center">
                          {book.cover ? (
                            <img src={book.cover} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{book.title}</div>
                          <div className="text-sm text-slate-500">{book.author}</div>
                          <div className="text-xs text-slate-400 mt-1">ISBN: {book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="primary">{category?.name || 'Inconnue'}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={book.available_copies > 0 ? 'success' : 'danger'}>
                        {book.available_copies} / {book.total_copies}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {book.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-1.5 text-slate-400 hover:text-library-indigo hover:bg-slate-50 rounded-md transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucun livre trouvé.</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Modifier le livre' : 'Ajouter un livre'}
        maxWidth="4xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Année</label>
                  <input
                    type="number"
                    required
                    value={formData.publication_year}
                    onChange={e => setFormData({ ...formData, publication_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all bg-white"
                >
                  {state.categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL de la couverture</label>
                <input
                  type="text"
                  value={formData.cover}
                  onChange={e => setFormData({ ...formData, cover: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total exemplaires</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.total_copies}
                    onChange={e => setFormData({ ...formData, total_copies: parseInt(e.target.value), available_copies: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emplacement</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all"
                    placeholder="Rayon A1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-library-navy text-white rounded-lg hover:bg-library-indigo transition-all shadow-md active:scale-95 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingBook ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}