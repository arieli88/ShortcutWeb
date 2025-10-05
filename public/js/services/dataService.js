import { CONFIG } from '../config.js';

// Exported binding so other modules can read the CSV header order once loaded
export let headers = [];

const dataService = {
    async loadData() {
        console.log('Loading data from:', CONFIG.API_URL);
        try {
            const response = await fetch(CONFIG.API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const text = await response.text();
            console.log('Received data length:', text.length);

            return new Promise((resolve, reject) => {
                Papa.parse(text, {
                    header: true,
                    complete: (results) => {
                        console.log('Parsed rows:', results.data.length);
                        // update exported headers binding
                        headers = results.meta.fields || [];
                        resolve({
                            headers,
                            rows: results.data.filter(row => 
                                Object.values(row).some(val => val && String(val).trim())
                            )
                        });
                    },
                    error: (error) => {
                        console.error('CSV Parse Error:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Data loading error:', error);
            throw error;
        }
    }
};

export default dataService;