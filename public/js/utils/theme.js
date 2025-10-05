export function initDarkMode() {
    const toggleButton = document.getElementById('toggleDark');
    const html = document.documentElement;

    const updateTheme = (isDark) => {
        html.classList.toggle('dark', isDark);
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
        toggleButton.innerHTML = isDark 
            ? '<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>מצב בהיר'
            : '<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>מצב כהה';
    };

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    updateTheme(savedDarkMode);

    toggleButton.addEventListener('click', () => {
        updateTheme(!html.classList.contains('dark'));
    });
}
