export function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50';
    
    loader.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="mt-4 text-lg font-medium text-blue-600 dark:text-blue-400">טוען נתונים...</div>
        </div>
    `;
    
    return loader;
}

export function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div class="mt-2 text-center">טוען נתונים...</div>
        </div>
    `;
    document.body.appendChild(loader);
}

export function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
}