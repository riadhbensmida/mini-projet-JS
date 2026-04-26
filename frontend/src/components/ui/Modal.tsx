import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}: ModalProps) {

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with higher z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden border border-slate-200`}
            >
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
                <h2 className="text-2xl font-serif font-bold text-library-navy">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-library-navy hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto bg-slate-50/30">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}