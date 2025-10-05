// src/utils/darkMode.js
export function applyDarkModeFromSystem() {
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

export function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
}