/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#ffffff',
        'sidebar-text': '#475569',
        'sidebar-hover': '#f8fafc',
        'sidebar-active': '#eff6ff',
      },
      width: {
        'sidebar': '240px',
      },
      margin: {
        'sidebar': '240px',
      },
      fontSize: {
        '2xs': '0.7rem',
      }
    },
  },
  plugins: [],
}