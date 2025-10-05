// src/utils/csvParser.js
export function parseCSV(str) {
  const rows = [];
  let row = [], cell = "", insideQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i], next = str[i + 1];
    if (c === '"') {
      if (insideQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (c === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !insideQuotes) {
      if (cell || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
    } else {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}