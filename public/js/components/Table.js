import { headers } from '../services/dataService.js';

function getField(row, headerName) {
    if (!row) return '';
    if (row[headerName] !== undefined) return String(row[headerName] || '');
    const key = Object.keys(row).find(k => k && k.toLowerCase() === headerName.toLowerCase());
    return key ? String(row[key] || '') : '';
}

export function createTable(rows) {
    const wrapper = document.createElement("div");
    wrapper.className = "overflow-x-auto shadow-md rounded-lg";
    wrapper.style.maxWidth = '100%';

    const table = document.createElement("table");
    table.className = "min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto";
    table.style.minWidth = '900px';

    // Create table header
    const thead = document.createElement("thead");
    thead.className = "bg-gray-50 dark:bg-gray-800";
    const headerRow = document.createElement("tr");

    headers.forEach(header => {
        if (!header.toLowerCase().startsWith('img')) {
            const th = document.createElement("th");
            th.className = "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider";
            th.textContent = header;
            headerRow.appendChild(th);
        }
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    tbody.className = "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700";

    rows.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.className = index % 2 === 0 ? 
            "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" : 
            "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";

        headers.forEach((header) => {
            if (!header.toLowerCase().startsWith('img')) {
                const td = document.createElement("td");
                td.className = "px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-normal break-words";
                const value = getField(row, header);
                // Always show NOTES and convert links
                if (header === "NOTES") {
                    td.innerHTML = String(value).replace(
                        /(https?:\/\/[^\s]+)/g,
                        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-words">$1</a>'
                    );
                } else {
                    td.textContent = value || '';
                }
                tr.appendChild(td);
            }
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
}