// src/config.js
export const CONFIG = {
    // Google Sheets URL as CSV
    API_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq0KoRvA4HCdJ0W_SZKv5i9J8L5-4KtV-ze_LV-eO6_PophLW5v92MvOfFq5KodZ0YX__1iETbySeR/pub?output=csv",
    
    // Data refresh settings
    REFRESH_INTERVAL: 300000, // 1 minute
    
    // Search settings
    SEARCH_THRESHOLD: 0.3,
    SEARCH_KEYS: ['title', 'description', 'category'],
    
    // Display settings
    DEFAULT_VIEW: 'cards',
    ITEMS_PER_PAGE: 12,
    
    // Theme settings
    DARK_MODE_KEY: 'darkMode',
    
    // Column mappings
    COLUMN_MAPPING: {
        title: 'כותרת',
        description: 'תיאור',
        category: 'קטגוריה',
        image: 'תמונה',
        link: 'קישור'
    }
};