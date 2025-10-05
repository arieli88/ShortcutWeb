export function initDarkMode() {
    const isDark = localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Apply dark class to both html and body to cover cases where styles target body
    document.documentElement.classList.toggle('dark', isDark);
    if (document.body) document.body.classList.toggle('dark', isDark);
    updateDarkModeButton(isDark);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
            updateDarkModeButton(e.matches);
        }
    });
}

export function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    if (document.body) document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeButton(isDark);
}

function updateDarkModeButton(isDark) {
    const button = document.getElementById('toggleDark');
    if (button) {
        button.innerHTML = isDark ? 
            `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
             </svg>מצב בהיר` : 
            `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
             </svg>מצב כהה`;
        button.className = `px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} rounded shadow hover:bg-opacity-90 text-sm flex items-center transition-colors duration-200`;
    }
}