import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, FolderTree, Save } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Category } from '../../types';

export function CategoryManagement() {
  const { state, addCategory } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    color: '#6366f1',
    parent_id: undefined
  });

  const rootCategories = state.categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) => {
    return state.categories.filter((c) => c.parent_id === parentId);
  };

  const getBookCount = (categoryId: string) => {
    return state.books.filter((b) => b.category_id === categoryId).length;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategory(formData as any);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', color: '#6366f1' });
    } catch (error) {
      alert("Erreur lors de la création de la catégorie.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-library-navy">Catégories</h1>
          <p className="text-slate-500 mt-1">Organisez les sections de la bibliothèque.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-library-amber hover:bg-library-amberLight transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-slate-100 p-6">
        <div className="space-y-4">
          {rootCategories.map((category) => (
            <div key={category.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <FolderTree size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                    {getBookCount(category.id)} livres
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-1.5 text-slate-400 hover:text-library-indigo rounded-md"><Edit2 size={16} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>

              {getSubcategories(category.id).length > 0 && (
                <div className="bg-white px-4 py-2 border-t border-slate-200">
                  <div className="pl-11 space-y-2">
                    {getSubcategories(category.id).map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: sub.color }} />
                          <span className="text-sm text-slate-700">{sub.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-slate-500">{getBookCount(sub.id)} livres</span>
                          <div className="flex space-x-1">
                            <button className="p-1 text-slate-400 hover:text-library-indigo rounded-md"><Edit2 size={14} /></button>
                            <button className="p-1 text-slate-400 hover:text-rose-600 rounded-md"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Catégorie">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input
              type="text" required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-library-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-library-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Couleur</label>
            <input
              type="color"
              value={formData.color}
              onChange={e => setFormData({ ...formData, color: e.target.value })}
              className="h-10 w-20 p-1 border border-slate-300 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Annuler</button>
            <button type="submit" className="bg-library-navy text-white px-6 py-2 rounded-lg flex items-center shadow-md">
              <Save className="w-4 h-4 mr-2" /> Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}