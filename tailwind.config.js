module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or false
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        dark: '#1f2937',
        light: '#f3f4f6',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};