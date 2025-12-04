/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Minimalist palette
        min: {
          bg: '#ffffff',
          surface: '#f9f9f9',
          border: '#e5e5e5',
          text: '#111111',
          subtext: '#666666',
          accent: '#000000', // Strong black for primary actions
          'accent-hover': '#333333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Serif removed/minimized for cleaner look, or kept for subtle headers
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
