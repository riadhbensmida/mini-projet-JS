import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/favicon.svg" alt="Bibli'Net" className="w-10 h-10" />
                        </div>
                        <span className="text-xl font-serif font-bold tracking-tight text-library-navy">Bibli'Net</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-600 hover:text-library-navy transition-colors"
                        >
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="bg-library-navy text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-library-indigo transition-all shadow-md active:scale-95"
                        >
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-library-amber/10 border border-library-amber/20 text-library-navy text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap className="w-3 h-3 text-library-amber" />
                            Modernisation des bibliothèques
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight text-library-navy mb-6">
                            Gérez votre bibliothèque avec <span className="text-library-amber">précision</span> et simplicité.
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                            Passez de la gestion manuelle à une plateforme numérique performante. Automatisez vos emprunts, calculez vos pénalités instantanément et offrez une expérience fluide à vos usagers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-library-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-library-indigo transition-all shadow-lg active:scale-95"
                            >
                                Commencer maintenant
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Explorer le catalogue
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white p-2">
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 italic text-slate-500 font-serif">
                                "Actuellement, la plupart des petites bibliothèques gèrent encore leurs opérations manuellement... Bibli'Net est la réponse à ce besoin de modernisation."
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern Library Management"
                                className="w-full h-64 object-cover rounded-md mt-4"
                            />
                        </div>
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-library-amber/20 blur-3xl rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-library-indigo/10 blur-3xl rounded-full" />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-library-navy mb-4">Une solution complète et automatisée</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Conçue pour répondre aux défis du d'administration moderne et du service aux membres.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Zap, title: "Prêts Automatisés", desc: "Empruntez vos livres en un clic. Le système calcule tout pour vous, de la date de retour aux rappels." },
                            { icon: Search, title: "Recherche Fluide", desc: "Trouvez votre prochaine lecture instantanément grâce à notre catalogue dynamique et filtré." },
                            { icon: ShieldCheck, title: "Service Fiable", desc: "Une plateforme sécurisée pour suivre votre historique de lecture et vos réservations en toute sérénité." },
                            { icon: ShoppingBag, title: "Catalogue Riche", desc: "Accédez à une large sélection d'ouvrages classés par catégories pour tous les goûts." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                            >
                                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-library-amber group-hover:text-library-navy transition-colors">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-library-navy mb-3">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-library-navy mb-6">Une expérience sur mesure</h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Que vous soyez un bibliothécaire cherchant à optimiser son temps ou un lecteur passionné, Bibli'Net s'adapte à vos besoins.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-library-navy/5 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheck className="text-library-navy w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-library-navy">Espace Administration</h4>
                                        <p className="text-sm text-slate-500">Outils de pilotage pour gérer les stocks de livres, suivre les membres et générer des rapports d'activité.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-library-amber/10 rounded-full flex items-center justify-center shrink-0">
                                        <ShoppingBag className="text-library-amber w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-library-navy">Espace Lecteur</h4>
                                        <p className="text-sm text-slate-500">Parcourez le catalogue, gérez vos emprunts (jusqu'à 3 livres) et suivez vos alertes de retour.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-library-navy rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                            <h3 className="text-2xl font-serif font-bold mb-6 italic text-library-amber">Notre Engagement</h3>
                            <p className="text-white/80 leading-relaxed mb-6">
                                "Offrir une plateforme intuitive et moderne qui simplifie l'accès à la culture pour tous, en automatisant les tâches répétitives pour se concentrer sur l'essentiel : la lecture."
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-library-amber">14j</div>
                                    <div className="text-xs uppercase tracking-wider font-bold opacity-60">Période de lecture</div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-library-amber">0.500 TND</div>
                                    <div className="text-xs uppercase tracking-wider font-bold opacity-60">Tarif par jour de retard</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 overflow-hidden relative">
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-library-navy rounded-[2rem] p-12 lg:p-20 relative overflow-hidden text-center shadow-2xl"
                    >
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                            Prêt à digitaliser votre lecture ?
                        </h2>
                        <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
                            Rejoignez Bibli'Net aujourd'hui. Inscription gratuite pour accéder à tout notre catalogue et gérer vos emprunts en temps réel.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="bg-library-amber text-library-navy px-10 py-4 rounded-xl font-bold text-lg hover:bg-library-amberLight transition-all active:scale-95 shadow-lg shadow-library-amber/20"
                            >
                                Créer un compte
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
                            >
                                Connexion
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 opacity-60">
                        <img src="/favicon.svg" alt="Bibli'Net" className="w-6 h-6" />
                        <span className="font-serif font-bold text-library-navy">Bibli'Net</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        &copy; 2026 Bibli'Net - Tous droits réservés. Design premium pour amoureux des livres.
                    </p>
                    <div className="flex gap-6 text-slate-400 text-sm font-medium">
                        <a href="#" className="hover:text-library-navy transition-colors">Confidentialité</a>
                        <a href="#" className="hover:text-library-navy transition-colors">Conditions</a>
                        <a href="#" className="hover:text-library-navy transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

