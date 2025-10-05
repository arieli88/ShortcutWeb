// src/services/api.js
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq0KoRvA4HCdJ0W_SZKv5i9J8L5-4KtV-ze_LV-eO6_PophLW5v92MvOfFq5KodZ0YX__1iETbySeR/pub?output=csv";

export const fetchData = async () => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};