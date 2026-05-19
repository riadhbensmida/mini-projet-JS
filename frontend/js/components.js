/**
 * Common Components for Vanilla Frontend
 * Updated with Premium React-style design
 */

const icons = {
    LayoutDashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    Users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    BookOpen: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    Tags: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m12 2 10 10-9.5 9.5-10-10"></path><path d="m5.41 5.41 5.08 5.08"></path><circle cx="8.5" cy="8.5" r="1.5"></circle></svg>',
    History: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>',
    CalendarClock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="M18 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M18 16.5V18l1 1"></path></svg>',
    Library: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>',
    BookMarked: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><polyline points="10 2 10 10 13 7 16 10 16 2"></polyline></svg>',
    Bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>',
    LogOut: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>',
    Menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>'
};

const components = {
    renderSidebar: (isAdmin) => {
        const adminLinks = [
            { to: '/admin/dashboard.html', icon: 'LayoutDashboard', label: 'Tableau de bord' },
            { to: '/admin/users.html', icon: 'Users', label: 'Membres' },
            { to: '/admin/books.html', icon: 'BookOpen', label: 'Livres' },
            { to: '/admin/categories.html', icon: 'Tags', label: 'Catégories' },
            { to: '/admin/loans.html', icon: 'History', label: 'Emprunts' },
            { to: '/admin/reservations.html', icon: 'CalendarClock', label: 'Réservations' }
        ];

        const memberLinks = [
            { to: '/member/dashboard.html', icon: 'LayoutDashboard', label: 'Mon espace' },
            { to: '/member/catalog.html', icon: 'Library', label: 'Catalogue' },
            { to: '/member/loans.html', icon: 'BookMarked', label: 'Mes emprunts' },
            { to: '/member/reservations.html', icon: 'CalendarClock', label: 'Mes réservations' }
        ];

        const links = isAdmin ? adminLinks : memberLinks;
        const currentPath = window.location.pathname;

        return `
            <aside class="w-64 bg-library-navy text-slate-300 flex flex-col h-full border-r border-library-indigo/30" style="view-transition-name: sidebar">
                <div class="h-16 flex items-center px-6 border-b border-library-indigo/30 bg-library-navy/50">
                    <div class="h-8 w-8 text-library-amber mr-3 flex items-center justify-center">
                        ${icons.BookOpen}
                    </div>
                    <span class="text-xl font-serif font-bold text-white tracking-wide">Bibli'Net</span>
                </div>

                <div class="flex-1 overflow-y-auto py-6 px-4">
                    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
                    <nav class="space-y-1">
                        ${links.map(link => {
            const isActive = currentPath === link.to || (currentPath === '/' && link.to === '/index.html');
            return `
                                <a href="${link.to}" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-library-indigo/40 text-white' : 'hover:bg-library-indigo/20 hover:text-white'}">
                                    <span class="mr-3 h-5 w-5 flex-shrink-0 flex items-center justify-center">${icons[link.icon]}</span>
                                    ${link.label}
                                </a>
                            `;
        }).join('')}
                    </nav>
                </div>

                <div class="p-4 border-t border-library-indigo/30 bg-library-navy/30">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-library-indigo flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            ${isAdmin ? 'A' : 'M'}
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-white">${isAdmin ? 'Espace Admin' : 'Espace Membre'}</p>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    },

    renderHeader: (user) => {
        return `
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm" style="view-transition-name: header">
                <div class="flex items-center">
                    <button class="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none">
                        ${icons.Menu}
                    </button>
                </div>

                <div class="flex items-center space-x-4">
                    <button class="p-2 text-slate-400 hover:text-library-amber transition-colors relative group">
                        ${icons.Bell}
                        <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                    </button>

                    <div class="h-8 w-px bg-slate-200 mx-2"></div>

                    <div class="flex items-center">
                        <div class="text-right mr-3 hidden sm:block">
                            <p class="text-sm font-bold text-slate-700 leading-tight">${user?.name || 'Utilisateur'}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${user?.role || 'Membre'}</p>
                        </div>
                        <div class="h-9 w-9 rounded-xl bg-library-amber/20 text-library-amber flex items-center justify-center font-bold border border-library-amber/30 shadow-sm transition-transform hover:scale-110 cursor-pointer">
                            ${(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <button onclick="api.auth.logout().then(() => window.location.href='/login.html')" class="ml-2 p-2 text-slate-400 hover:text-rose-500 transition-colors group" title="Déconnexion">
                        ${icons.LogOut}
                    </button>
                </div>
            </header>
        `;
    }
};

window.components = components;
