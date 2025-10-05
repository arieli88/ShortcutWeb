import { createCard } from './Card.js';
import { createTable } from './Table.js';
import { headers } from '../services/dataService.js';

export function renderGroups(rows, viewType = 'accordion') {
    console.log('Rendering groups:', rows?.length, 'rows');
    const container = document.getElementById('groupContainer');

    if (!container) return;
    if (!rows?.length) {
        container.innerHTML = '<div class="text-center p-4">אין נתונים להצגה</div>';
        return;
    }

    // Group the rows
    const groups = {};
    rows.forEach(row => {
        const groupName = row.Groups || row.Groups || 'כללי';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(row);
    });

    container.innerHTML = '';
    Object.entries(groups).forEach(([groupName, items]) => {
        const section = document.createElement('div');
        section.className = 'accordion-item mb-2 border rounded-lg overflow-hidden';

        section.innerHTML = `
            <button class="w-full p-3 text-right bg-blue-600 text-white flex justify-between items-center">
                <span class="font-bold">${groupName} <span class="text-sm font-normal ml-2">(${items.length})</span></span>
                <span class="transform transition-transform">▼</span>
            </button>
            <div class="accordion-content bg-white dark:bg-gray-800 p-3"></div>
        `;

        const content = section.querySelector('.accordion-content');
        if (viewType === 'table') {
            content.appendChild(createTable(items));
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid gap-3 md:grid-cols-2 lg:grid-cols-3';
            items.forEach(item => grid.appendChild(createCard(item)));
            content.appendChild(grid);
        }

        container.appendChild(section);
    });

    // Add accordion functionality
    container.querySelectorAll('.accordion-item button').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const arrow = button.querySelector('span:last-child');
            if (!content) return;
            content.classList.toggle('open');
            if (arrow) arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : '';
        });
    });
}

function renderCard(item) {
    return `
        <div class="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 class="font-bold text-lg mb-2">${item.title || item.TITLE || 'ללא כותרת'}</h3>
            ${item.image ? `<img src="${item.image}" alt="" class="w-full h-48 object-cover mb-2 rounded">` : ''}
            <p class="text-gray-600 dark:text-gray-400">${item.description || item.NOTES || ''}</p>
            ${item.link ? `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" 
                   class="mt-2 text-blue-600 hover:underline block">
                    פתח קישור
                </a>
            ` : ''}
        </div>
    `;
}

function renderTableRow(item) {
    return `
        <tr>
            <td class="border px-4 py-2">${item.title || item.TITLE || ''}</td>
            <td class="border px-4 py-2">${item.description || item.NOTES || ''}</td>
            <td class="border px-4 py-2">${item.Groups || ''}</td>
        </tr>
    `;
}