/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        assam: {
          maroon: '#800000',
          gold: '#d97706',
          crimson: '#dc2626',
          navy: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'Hind Siliguri', 'sans-serif'],
        assamese: ['Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', 'sans-serif']
      }
    },
  },
  plugins: [],
}
