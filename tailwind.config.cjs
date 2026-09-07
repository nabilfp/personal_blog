/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', // deep blue
        secondary: '#2563eb', // lighter blue
        accent: '#f59e0b', // amber for highlights
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
