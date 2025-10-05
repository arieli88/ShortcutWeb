// src/services/search.js
export function searchItems(allRows, searchTerm) {
  if (!searchTerm) return allRows;

  const lowerCaseTerm = searchTerm.toLowerCase();
  return allRows.filter(row => {
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(lowerCaseTerm)
    );
  });
}