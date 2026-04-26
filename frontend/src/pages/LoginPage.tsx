import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    }
  }, [user, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (!success) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-library-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-library-amber/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-library-indigo/10 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="flex justify-center">

          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-warm-lg transform rotate-3 p-2">
            <img src="/favicon.svg" alt="Bibli'Net" className="w-full h-full transform -rotate-3" />
          </div>
        </motion.div>
        <motion.h2
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.1
          }}
          className="mt-6 text-center text-3xl font-serif font-bold text-library-navy">

          Bienvenue sur Bibli'Net
        </motion.h2>
        <motion.p
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="mt-2 text-center text-sm text-slate-600">

          Votre système de gestion de bibliothèque
        </motion.p>
      </div>

      <motion.div
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.3
        }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">

        <div className="bg-white py-8 px-4 shadow-warm-lg sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error &&
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                </div>
              </div>
            }

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700">

                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber sm:text-sm transition-colors"
                  placeholder="vous@exemple.fr" />

              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700">

                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-library-amber focus:border-library-amber sm:text-sm transition-colors"
                  placeholder="••••••••" />

              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-library-navy hover:bg-library-indigo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-navy transition-colors">

                Se connecter
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>);

}