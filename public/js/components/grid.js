export function createDataGrid(container, data) {
    container.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-white dark:bg-gray-800 rounded shadow';
        
        card.innerHTML = `
            <h3 class="text-lg font-semibold">${item.name}</h3>
            <p class="text-gray-600 dark:text-gray-400">${item.description}</p>
            <div class="mt-2">
                <span class="inline-block px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    ${item.category}
                </span>
            </div>
        `;
        
        grid.appendChild(card);
    });

    container.appendChild(grid);
}
