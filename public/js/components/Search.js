// Use the global Fuse (provided by a script shim in index.html) when available.
// Fallback: dynamically import the ESM build from jsDelivr if not present.
async function getFuseConstructor() {
    if (typeof window !== 'undefined' && window.Fuse) return window.Fuse;
    try {
        const mod = await import('https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.min.js');
        // ESM build usually exports default
        return mod.default || mod.Fuse || mod;
    } catch (err) {
        console.error('Failed to load Fuse.js dynamically:', err);
        throw err;
    }
}

export async function createSearchBar(container, data, onSearch) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'relative';
    
    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.type = 'text';
    searchInput.placeholder = 'חיפוש...';
    searchInput.className = 'w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500';
    
    const FuseCtor = await getFuseConstructor();
    const fuse = new FuseCtor(data, {
        keys: ['name', 'description', 'category'],
        threshold: 0.4
    });

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const results = value ? fuse.search(value).map(result => result.item) : data;
        onSearch(results);
    });

    searchWrapper.appendChild(searchInput);
    container.appendChild(searchWrapper);
}

export function createSearchInput() {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'relative';
    
    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.type = 'text';
    searchInput.placeholder = 'חיפוש...';
    searchInput.className = 'w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500';
    
    searchWrapper.appendChild(searchInput);
    return searchWrapper;
}