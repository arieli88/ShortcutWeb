// Remove old fuse import since we're using the global Fuse object from CDN
// import Fuse from 'fuse.js';

// CONFIG already imported at top
import { createSearchInput } from './components/Search.js';
import { showLoader, hideLoader } from './components/Loader.js';
import { renderGroups as renderGroupsComponent } from './components/Groups.js';
import dataService from './services/dataService.js';
import { initDarkMode, toggleDarkMode } from './utils/darkMode.js';
import { CONFIG } from './config.js';

// Global state
let allRows = [];
let headers = [];
let fuse = null;
let currentView = "cards";

// Ensure Fuse is available in the browser (global or dynamic import)
async function getFuseCtor() {
    if (typeof window !== 'undefined' && window.Fuse) return window.Fuse;
    try {
        const mod = await import('https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.min.js');
        return mod.default || mod.Fuse || mod;
    } catch (err) {
        console.error('Failed to load Fuse.js:', err);
        throw err;
    }
}

// Use shared renderer from components to avoid duplicated array-indexed logic
function renderGroups(rows, viewType = 'accordion') {
    // delegate to Groups.js renderer which works with object rows
    renderGroupsComponent(rows, viewType === 'table' ? 'table' : 'accordion');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing application...');
        // initialize dark mode according to preference/localStorage
        initDarkMode();
        
        // Add search input
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.appendChild(createSearchInput());
        }

        showLoader();
        console.log('Fetching and parsing data via dataService...');
        const { headers: svcHeaders, rows } = await dataService.loadData();
    headers = svcHeaders || [];
    allRows = rows || [];
    console.log('Loaded headers:', headers);
    console.log('Sample row:', allRows.length ? allRows[0] : 'No rows');

        // Initialize search (ensure Fuse is loaded first)
        initializeSearch(allRows).then(() => {
            renderGroups(allRows, currentView);
            setupEventListeners();
            // set initial label for toggleView with icon preserved
            const toggleBtn = document.getElementById('toggleView');
            if (toggleBtn) toggleBtn.innerHTML = `<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>תצוגת טבלה`;
            hideLoader();
        }).catch(err => {
            console.error('Search initialization failed:', err);
            renderGroups(allRows, currentView);
            setupEventListeners();
            const toggleBtn = document.getElementById('toggleView');
            if (toggleBtn) toggleBtn.innerHTML = `<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>תצוגת טבלה`;
            hideLoader();
        });

        // Periodic client-side refresh (works for static hosting too)
        setInterval(async () => {
            if (document.hidden) return; // don't refresh when tab is hidden
            try {
                console.log('Refreshing data...');
                const { headers: newHeaders, rows: newRows } = await dataService.loadData();
                headers = newHeaders || headers;
                allRows = newRows || allRows;
                // re-init search and re-render
                await initializeSearch(allRows);
                renderGroups(allRows, currentView);
            } catch (err) {
                console.warn('Periodic refresh failed:', err);
            }
        }, 3600000); // every 600s

    } catch (error) {
        console.error('Failed to initialize:', error);
        document.getElementById('groupContainer').innerHTML = `
            <div class="text-red-500 text-center p-4">
                שגיאה בטעינת הנתונים: ${error.message}
            </div>
        `;
    } finally {
        hideLoader();
    }
});

function setupEventListeners() {
    document.querySelector('#searchInput')?.addEventListener('input', handleSearch);
    document.querySelector('#toggleView')?.addEventListener('click', handleViewToggle);
    document.querySelector('#toggleDark')?.addEventListener('click', toggleDarkMode);
    document.querySelector('#popupClose')?.addEventListener('click', closePopup);
    document.querySelector('#addItem')?.addEventListener('click', () => {
        // open the Google Sheets form/view in a new tab so user can add items
        // window.open(CONFIG.API_URL.replace(/output=csv/, ''), '_blank');
        window.open(
                'https://docs.google.com/spreadsheets/d/1i9W8LZvUf76b8vYF4dvnvWMGls_f5PiX8SqEt0OwM_o/edit?pli=1&gid=0#gid=0',
                '_blank'
    );
    });
}

function handleViewToggle() {
    currentView = currentView === 'cards' ? 'table' : 'cards';
    // update button text
    const btn = document.getElementById('toggleView');
    if (btn) btn.textContent = currentView === 'cards' ? 'תצוגת טבלה' : 'תצוגת כרטיסים';
    // re-render
    renderGroups(allRows, currentView === 'cards' ? 'accordion' : 'table');
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) overlay.classList.add('hidden');
}

async function initializeSearch(rows) {
    try {
        const FuseCtor = await getFuseCtor();
        // create search objects from rows (rows are objects since PapaParse header:true)
        fuse = new FuseCtor(rows, { keys: headers.filter(h => !h.toLowerCase().startsWith('img')), threshold: 0.35 });
        console.log('Fuse initialized with', rows.length, 'rows');
        return fuse;
    } catch (err) {
        console.error('Failed to initialize Fuse search:', err);
        throw err;
    }
}

function handleSearch(e) {
    console.log('Handling search:', e.target.value);
    const term = e.target.value.trim();
    
    if (!term) {
        renderGroups(allRows, currentView);
        return;
    }

    if (!fuse) {
        console.warn('Search attempted before fuse initialized; falling back to client filter');
        const fallback = allRows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(term.toLowerCase())));
        renderGroups(fallback, currentView);
        return;
    }

    const results = fuse.search(term).map(result => result.item);
    renderGroups(results, currentView);
}

// Export only what's needed
export { renderGroups };