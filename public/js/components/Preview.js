export function showScriptPreview(scriptContent, title) {
    // Prefer the static overlay if present (index.html provides one with id popupOverlay)
    let overlay = document.getElementById('popupOverlay');
    if (overlay) {
        // static overlay contains an iframe and a close button with id 'popupClose'
        const dialog = overlay.querySelector('div > div');
        const iframe = overlay.querySelector('iframe');
        const closeBtn = overlay.querySelector('#popupClose');
        if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
        // close when clicking outside dialog
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
        // close on ESC
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.add('hidden'); });

        // Set popup title
        const titleElem = overlay.querySelector('#popupTitle');
        if (titleElem) titleElem.textContent = title || '';
        // If iframe present, load content via srcdoc for script/HTML
        if (iframe) {
            const s = String(scriptContent).trim();
            if (s.startsWith('<script') || s.startsWith('<html') || s.startsWith('<iframe')) {
                iframe.srcdoc = s;
            } else {
                // treat as HTML/notes; wrap in minimal HTML
                iframe.srcdoc = `<html><body>${s}</body></html>`;
            }
        }
        // center dialog responsively (Tailwind classes already center it), show overlay
        overlay.classList.remove('hidden');
        return;
    }

    // otherwise create a dynamic overlay
    overlay = document.createElement('div');
    overlay.id = 'popupOverlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-11/12 max-w-2xl relative">
            <button id="popupCloseBtn" class="absolute top-2 left-2 text-red-600 font-bold">✖</button>
            <div id="popupTitle" class="font-bold text-lg mb-2"></div>
            <div id="popupContent" class="w-full h-96 overflow-auto"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#popupCloseBtn').addEventListener('click', () => overlay.classList.add('hidden'));

    overlay.querySelector('#popupTitle').textContent = title || '';
    const content = overlay.querySelector('#popupContent');
    content.innerHTML = String(scriptContent);
    overlay.classList.remove('hidden');
}