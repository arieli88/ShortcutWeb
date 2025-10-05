import { showScriptPreview } from './Preview.js';
import { headers } from '../services/dataService.js';

// Utility to read a field from a row with a header name (case-insensitive)
function getField(row, headerName) {
    if (!row || !headerName) return '';
    // Try direct
    if (row[headerName] !== undefined) return String(row[headerName] || '');
    // Try case-insensitive match
    const key = Object.keys(row).find(k => k && k.toLowerCase() === headerName.toLowerCase());
    return key ? String(row[key] || '') : '';
}

export function createCard(row) {
    const card = document.createElement("div");
    card.className = "card border rounded-lg p-4 shadow bg-white dark:bg-gray-800 transition-all relative hover:shadow-2xl hover:scale-[1.02] hover:z-10 duration-300";

    const titleVal = (getField(row, 'TITLE') || getField(row, 'title') || '').trim() || 'ללא כותרת';
    const kindVal = (getField(row, 'kind') || getField(row, 'KIND') || '').trim();
    const notesVal = (getField(row, 'NOTES') || getField(row, 'notes') || '').trim();
    const idRowVal = (getField(row, 'ID_ROW') || getField(row, 'id_row') || '').trim();

    // ID Badge (above title)
    if (idRowVal) {
        const idBadge = document.createElement("div");
        idBadge.className = "text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded inline-block mb-2";
        idBadge.textContent = `#${idRowVal}`;
        card.appendChild(idBadge);
    }

    // Title
    const title = document.createElement("h3");
    title.className = "font-bold text-lg text-blue-700 dark:text-blue-400 mb-2";
    title.textContent = titleVal;
    card.appendChild(title);

    // Images
    const imgs = getImageUrls(row);
    if (imgs.length > 0) {
        const carousel = createImageCarousel(imgs);
        if (carousel) card.appendChild(carousel);
    }

    // Notes (always show, even if preview button exists)
    {
        const notesContainer = document.createElement("div");
        notesContainer.className = "mt-2 overflow-hidden";

        const processedNotes = notesVal.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline break-words inline-flex items-center gap-1">$1<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>'
        );

            if (notesVal.length > 150) {
                const shortNotes = document.createElement("div");
                const fullNotes = document.createElement("div");
                const toggleBtn = document.createElement("button");

                shortNotes.className = "text-sm text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap";
                fullNotes.className = "text-sm text-gray-600 dark:text-gray-400 hidden break-words whitespace-pre-wrap";
                toggleBtn.className = "text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline mt-1 block";

                shortNotes.innerHTML = processedNotes.substring(0, 150) + "...";
                fullNotes.innerHTML = processedNotes;
                toggleBtn.textContent = "הצג עוד";

                toggleBtn.onclick = () => {
                    const isExpanded = fullNotes.classList.contains("hidden");
                    fullNotes.classList.toggle("hidden");
                    shortNotes.classList.toggle("hidden");
                    toggleBtn.textContent = isExpanded ? "הצג פחות" : "הצג עוד";
                };

                notesContainer.appendChild(shortNotes);
                notesContainer.appendChild(fullNotes);
                notesContainer.appendChild(toggleBtn);
            } else {
                const notes = document.createElement("div");
                notes.className = "text-sm text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap";
                // notes.innerHTML = processedNotes;
                notes.textContent = notesVal;
                notesContainer.appendChild(notes);
            }

        card.appendChild(notesContainer);
    }

    // Rank (stars) if RANK column exists and has numeric value 1-5
    const rankVal = (getField(row, 'RANK') || getField(row, 'rank') || '').trim();
    if (rankVal) {
        const n = Math.max(0, Math.min(5, parseInt(rankVal, 10) || 0));
        if (n > 0) {
            const stars = document.createElement('div');
            stars.className = 'mt-2 flex items-center gap-1';
            stars.setAttribute('aria-label', `דירוג ${n} מתוך 5`);
            for (let i = 0; i < 5; i++) {
                const s = document.createElement('span');
                s.innerHTML = i < n ? '★' : '☆';
                s.style.color = i < n ? '#f6c85f' : '#d1d5db';
                s.style.fontSize = '20px';
                s.style.lineHeight = '1';
                stars.appendChild(s);
            }
            card.appendChild(stars);
        }
    }

    // Address link (open Google Maps) if Address column exists
    const address = (getField(row, 'Address') || getField(row, 'address') || '').trim();
    if (address) {
        const a = document.createElement('a');
        // If the address appears to be coordinates or a URL, prefer direct link; otherwise use Google Maps search
        const mapsUrl = address.startsWith('http') ? address : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        a.href = mapsUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'text-sm text-blue-600 hover:underline mt-2 block';
        a.textContent = 'פתח במפות';
        card.appendChild(a);
    }

    // Preview button for formulas
    if (kindVal.toLowerCase().includes('נוסחה')) {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "mt-4 flex gap-2 justify-end";

        const previewBtn = document.createElement("button");
        previewBtn.className = "text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1";
        previewBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            תצוגה מקדימה
        `;
        previewBtn.onclick = () => showScriptPreview(notesVal, titleVal);
        buttonsContainer.appendChild(previewBtn);
        card.appendChild(buttonsContainer);
    }

    return card;
}

export function getImageUrls(row) {
    const imgs = [];
    headers.forEach((h) => {
        if (h && h.toLowerCase().startsWith('img')) {
            const val = getField(row, h);
            if (val) imgs.push(val);
        }
    });
    return imgs;
}

export function createImageCarousel(imageUrls) {
    if (imageUrls.length === 0) return null;

    const container = document.createElement("div");
    container.className = "image-carousel relative overflow-hidden rounded mb-2 h-48";
    container.style.position = 'relative';

    imageUrls.forEach((url, i) => {
        const img = document.createElement("img");
        img.src = url;
        img.classList.add('w-full', 'h-48', 'object-cover', 'rounded');
        if (i === 0) img.classList.add('active');
        container.appendChild(img);
    });

    if (imageUrls.length > 1) {
        let current = 0;
        setInterval(() => {
            const imgs = container.getElementsByTagName("img");
            imgs[current].classList.remove('active');
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
        }, 3000);
    }

    return container;
}