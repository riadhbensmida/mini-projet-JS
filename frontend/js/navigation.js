/**
 * Premium Soft Navigation System
 * Transforms an MPA into a smooth SPA-like experience
 */

document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    
    // Only intercept internal .html links
    if (!link || !link.href || !link.href.startsWith(window.location.origin) || !link.href.endsWith('.html')) {
        return;
    }

    // Don't intercept if it's the same page
    if (link.href === window.location.href) {
        e.preventDefault();
        return;
    }

    e.preventDefault();
    navigateTo(link.href);
});

async function navigateTo(url) {
    try {
        // Start fade out
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease-in-out';

        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Wait for fade out to complete
        await new Promise(r => setTimeout(r, 200));

        // Update URL
        window.history.pushState({}, '', url);

        // Update Title
        document.title = doc.title;

        // Update Body Content
        // We only swap the parts that change (the main content)
        // If the current page and next page have different structures, we swap the whole body
        const newMain = doc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.innerHTML = newMain.innerHTML;
            
            // Re-run scripts in the new content
            const scripts = newMain.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
            
            // If there's an init() function in the window, call it
            if (typeof window.init === 'function') {
                window.init();
            } else {
                // If the script was internal to the HTML, it might have auto-executed.
                // We try to trigger common initialization functions.
                if (typeof loadDashboardData === 'function') loadDashboardData();
                if (typeof loadBooks === 'function') loadBooks();
            }
        } else {
            // Fallback for pages with different structures (like login)
            document.body.innerHTML = doc.body.innerHTML;
            // Force reload for login/register to ensure scripts run correctly
            if (url.includes('login.html') || url.includes('register.html')) {
                window.location.reload();
                return;
            }
        }

        // Fade back in
        document.body.style.opacity = '1';
        
        // Scroll to top
        window.scrollTo(0, 0);

    } catch (err) {
        console.error('Navigation failed:', err);
        window.location.href = url; // Fallback to hard reload
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    window.location.reload();
});
