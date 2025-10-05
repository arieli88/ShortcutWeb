// src/services/dataProcessor.js
import { parseCSV } from '../utils/csvParser';

// Function to process and organize data from Google Sheets
export const processData = (csvData) => {
  const rows = parseCSV(csvData);
  const headers = rows.shift();
  const groupedData = groupBy(rows, headers.indexOf('Groups'));
  
  return { headers, groupedData };
};

// Function to group data by a specified column index
const groupBy = (data, groupIndex) => {
  return data.reduce((acc, row) => {
    const groupKey = row[groupIndex] || 'Uncategorized';
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(row);
    return acc;
  }, {});
};

// Function to refresh data in the background
export const refreshData = async (fetchDataFunction) => {
  try {
    const newData = await fetchDataFunction();
    return processData(newData);
  } catch (error) {
    console.error('Error refreshing data:', error);
    return null;
  }
};