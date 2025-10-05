export function parseCSV(str) {
    console.log('Starting CSV parsing...');
    const rows = [];
    const lines = str.split(/\r?\n/);
    
    lines.forEach(line => {
        if (line.trim()) {
            const values = [];
            let cell = "", insideQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const c = line[i], next = line[i + 1];
                if (c === '"') {
                    if (insideQuotes && next === '"') { cell += '"'; i++; }
                    else { insideQuotes = !insideQuotes; }
                } else if (c === "," && !insideQuotes) {
                    values.push(cell);
                    cell = "";
                } else {
                    cell += c;
                }
            }
            values.push(cell);
            rows.push(values);
        }
    });

    console.log(`Parsed ${rows.length} rows from CSV`);
    return rows;
}