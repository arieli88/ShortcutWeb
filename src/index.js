/**
 * Main application entry point
 * Handles data fetching, processing, and rendering of the dashboard
 * @author Your Name
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// In bundler environments this file can import 'fuse.js' normally.
// For direct browser usage (no bundler), we attempt to use window.Fuse or
// dynamically import the ESM build from a CDN when needed.
let Fuse;
async function ensureFuse() {
    if (Fuse) return Fuse;
    if (typeof window !== 'undefined' && window.Fuse) {
        Fuse = window.Fuse;
        return Fuse;
    }
    try {
        const mod = await import('https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.min.js');
        Fuse = mod.default || mod.Fuse || mod;
        return Fuse;
    } catch (err) {
        console.error('Failed to load Fuse.js:', err);
        throw err;
    }
}

// Configuration
const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq0KoRvA4HCdJ0W_SZKv5i9J8L5-4KtV-ze_LV-eO6_PophLW5v92MvOfFq5KodZ0YX__1iETbySeR/pub?output=csv",
    REFRESH_INTERVAL: 60000, // 1 minute
    SEARCH_THRESHOLD: 0.3
};

// Global state
let allRows = [];
let headers = [];
let dataObjects = [];
let fuse = null;
let currentView = "cards";
let lastFetchTime = 0;

/**
 * Parses CSV string into array of rows
 * @param {string} str - Raw CSV string
 * @returns {Array<Array<string>>} Parsed rows
 */
function parseCSV(str) {
    console.log('Parsing CSV data...');
    const rows = [];
    const lines = str.split('\n');
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            const values = line.split(',').map(val => val.trim());
            rows.push(values);
        }
    });

    console.log(`Parsed ${rows.length} rows from CSV`);
    return rows;
}

/**
 * Main App Component
 */
const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Loads data from Google Sheets
     * @param {boolean} force - Force refresh regardless of time
     */
    const loadData = async (force = false) => {
    //     console.log('Loading data...', force ? '(forced refresh)' : '');
        
    //     const now = Date.now();
    //     if (!force && now - lastFetchTime < CONFIG.REFRESH_INTERVAL) {
    //         console.log('Skipping refresh - too soon');
    //         return;
    //     }

    //     setLoading(true);
    //     setError(null);

    //     try {
    //         console.log('Fetching from URL:', CONFIG.CSV_URL);
    //         const response = await fetch(`${CONFIG.CSV_URL}&ts=${now}`);
            
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
            
    //         const text = await response.text();
    //         console.log('Received raw data length:', text.length);

    //         const rows = parseCSV(text);
    //         console.log('First row:', rows[0]); // Log headers
            
    //         headers = rows.shift();
    //         allRows = rows;
    //         lastFetchTime = now;

    //         // Create searchable objects
    //         dataObjects = allRows.map(row => {
    //             const obj = {};
    //             headers.forEach((h, i) => obj[h] = row[i]);
    //             return obj;
    //         });

    //         console.log('Processed data objects:', dataObjects.length);
    //         console.log('Sample data object:', dataObjects[0]);

    //         // Initialize Fuse.js search
    //         const fuseOptions = {
    //             threshold: CONFIG.SEARCH_THRESHOLD,
    //             keys: headers.filter(h => !h.toLowerCase().startsWith("img"))
    //         };
    //         fuse = new Fuse(dataObjects, fuseOptions);

    //         setData(allRows);
    //         console.log('Data loaded successfully');
            
    //     } catch (error) {
    //         console.error('Error loading data:', error);
    //         setError(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    /**
     * Sets up background refresh interval
     */
    const startBackgroundRefresh = () => {
        console.log('Starting background refresh...');
        setInterval(() => {
            if (document.hidden) {
                console.log('Page hidden, skipping refresh');
                return;
            }
            console.log('Running background refresh');
            loadData(true);
        }, CONFIG.REFRESH_INTERVAL);
    };

    // Initial load
    useEffect(() => {
        console.log('Component mounted, initializing...');
        loadData(true);
        startBackgroundRefresh();

        // Event listeners
        const searchInput = document.getElementById("searchInput");
        const toggleView = document.getElementById("toggleView");
        const toggleDark = document.getElementById("toggleDark");

        if (searchInput) searchInput.addEventListener("input", handleSearch);
        if (toggleView) toggleView.addEventListener("click", handleViewToggle);
        if (toggleDark) toggleDark.addEventListener("click", handleDarkMode);

        return () => {
            console.log('Cleaning up...');
            // Remove event listeners on unmount
            if (searchInput) searchInput.removeEventListener("input", handleSearch);
            if (toggleView) toggleView.removeEventListener("click", handleViewToggle);
            if (toggleDark) toggleDark.removeEventListener("click", handleDarkMode);
        };
    }, []);

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="text-red-600 text-center mb-4">
                    Error: {error}
                </div>
            )}
            {loading ? (
                <div className="text-center">Loading data...</div>
            ) : (
                <div>
                    <div className="mb-4">
                        <strong>Stats:</strong> {data.length} rows loaded
                    </div>
                    {renderGroups(data)}
                </div>
            )}
        </div>
    );
};

// Initialize the app
console.log('Initializing application...');
ReactDOM.render(<App />, document.getElementById('root'));
}
// Add your existing helper functions here...