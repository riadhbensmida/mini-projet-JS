import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Book,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle } from
'lucide-react';
import { motion } from 'framer-motion';
export function BookCatalog() {
  const { state, user, borrowBook, reserveBook } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const filteredBooks = state.books.filter((b) => {
    const matchesSearch =
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
    selectedCategory === 'all' || b.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const handleBorrow = (bookId: string) => {
    if (!user) return;
    const success = borrowBook(bookId, user.id);
    if (success) {
      setActionMessage({
        type: 'success',
        text: 'Livre emprunté avec succès !'
      });
      setTimeout(() => {
        setActionMessage(null);
        setSelectedBook(null);
      }, 2000);
    } else {
      setActionMessage({
        type: 'error',
        text: "Impossible d'emprunter ce livre. Vérifiez vos quotas ou pénalités."
      });
    }
  };
  const handleReserve = (bookId: string) => {
    if (!user) return;
    const success = reserveBook(bookId, user.id);
    if (success) {
      setActionMessage({
        type: 'success',
        text: 'Livre réservé avec succès !'
      });
      setTimeout(() => {
        setActionMessage(null);
        setSelectedBook(null);
      }, 2000);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-library-navy">
          Catalogue
        </h1>
        <p className="text-slate-500 mt-1">
          Explorez notre collection et trouvez votre prochaine lecture.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un titre, un auteur..."
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map((book, index) => {
          const category = state.categories.find(
            (c) => c.id === book.category_id
          );
          const isAvailable = book.available_copies > 0;
          return (
            <motion.div
              key={book.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-warm-lg transition-all cursor-pointer group flex flex-col"
              onClick={() => {
                setSelectedBook(book);
                setActionMessage(null);
              }}>
              
              <div className="aspect-[2/3] bg-slate-100 relative overflow-hidden">
                {book.cover ?
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> :


                <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                }
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={isAvailable ? 'success' : 'neutral'}
                    className="shadow-sm backdrop-blur-md bg-white/90">
                    
                    {isAvailable ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p
                  className="text-xs font-medium mb-1"
                  style={{
                    color: category?.color
                  }}>
                  
                  {category?.name}
                </p>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-library-indigo transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-auto">
                  {book.author}
                </p>
              </div>
            </motion.div>);

        })}
      </div>

      {filteredBooks.length === 0 &&
      <div className="text-center py-20">
          <Book className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            Aucun livre trouvé
          </h3>
          <p className="text-slate-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      }

      {/* Book Detail Modal */}
      <Modal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        title="Détails du livre"
        maxWidth="2xl">
        
        {selectedBook &&
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden shadow-md">
                {selectedBook.cover ?
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-full h-full object-cover" /> :


              <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
              }
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-serif font-bold text-library-navy mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-lg text-slate-600">{selectedBook.author}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                variant={
                selectedBook.available_copies > 0 ? 'success' : 'neutral'
                }>
                
                  {selectedBook.available_copies} / {selectedBook.total_copies}{' '}
                  exemplaires disponibles
                </Badge>
                <Badge variant="primary">
                  {
                state.categories.find(
                  (c) => c.id === selectedBook.category_id
                )?.name
                }
                </Badge>
                <Badge variant="neutral">
                  Année: {selectedBook.publication_year}
                </Badge>
              </div>

              <div className="prose prose-sm text-slate-600 mb-6 flex-1">
                <p>{selectedBook.description}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-600 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Éditeur:</span>{' '}
                  {selectedBook.publisher}
                </div>
                <div>
                  <span className="font-medium">ISBN:</span> {selectedBook.isbn}
                </div>
                <div>
                  <span className="font-medium">Emplacement:</span>{' '}
                  {selectedBook.location}
                </div>
              </div>

              {actionMessage &&
            <div
              className={`p-3 rounded-lg mb-4 flex items-center text-sm ${actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              
                  {actionMessage.type === 'success' ?
              <CheckCircle className="w-4 h-4 mr-2" /> :

              <AlertCircle className="w-4 h-4 mr-2" />
              }
                  {actionMessage.text}
                </div>
            }

              <div className="mt-auto flex gap-3">
                {selectedBook.available_copies > 0 ?
              <button
                onClick={() => handleBorrow(selectedBook.id)}
                className="flex-1 bg-library-amber hover:bg-library-amberLight text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm">
                
                    Emprunter
                  </button> :

              <button
                onClick={() => handleReserve(selectedBook.id)}
                className="flex-1 bg-library-indigo hover:bg-library-indigo/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm">
                
                    Réserver
                  </button>
              }
                <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                
                  Fermer
                </button>
              </div>
            </div>
          </div>
        }
      </Modal>
    </div>);

}