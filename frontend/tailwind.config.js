/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#D30000',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#D30000',
          800: '#800000',
          900: '#991b1b',
          950: '#7f1d1d',
        },
        'dark-red': '#B30000',
        'light-maroon': '#FF4444',
        'red-gradient': '#D30000',
        'maroon-gradient': '#800000',
      },
      backgroundImage: {
        'maroon-gradient': 'linear-gradient(135deg, #D30000 0%, #800000 100%)',
        'maroon-light-gradient': 'linear-gradient(135deg, #D30000 0%, #dc2626 50%, #800000 100%)',
        'maroon-soft-gradient': 'linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #fca5a5 100%)',
        'maroon-hover-gradient': 'linear-gradient(135deg, #800000 0%, #D30000 100%)',
        'maroon-glass': 'linear-gradient(135deg, rgba(211, 0, 0, 0.1) 0%, rgba(128, 0, 0, 0.2) 100%)',
        'red-to-maroon': 'linear-gradient(135deg, #D30000 0%, #800000 100%)',
        'maroon-to-red': 'linear-gradient(135deg, #800000 0%, #D30000 100%)',
      },
      boxShadow: {
        'maroon-sm': '0 1px 2px 0 rgba(211, 0, 0, 0.05)',
        'maroon-md': '0 4px 6px -1px rgba(211, 0, 0, 0.1), 0 2px 4px -1px rgba(211, 0, 0, 0.06)',
        'maroon-lg': '0 10px 15px -3px rgba(211, 0, 0, 0.1), 0 4px 6px -2px rgba(211, 0, 0, 0.05)',
        'maroon-xl': '0 20px 25px -5px rgba(211, 0, 0, 0.1), 0 10px 10px -5px rgba(211, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
