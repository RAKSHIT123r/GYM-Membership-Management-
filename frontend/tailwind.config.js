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
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e', // Primary Electric Lime Accent
          600: '#16a34a',
          700: '#15803d',
        },
        dark: {
          bg: '#0B0D10',       // Dark Charcoal main background
          surface: '#14171F',  // Card container surface
          card: '#1C202B',     // Elevated card background
          border: '#2A303F',   // Border highlight
          muted: '#8E9BB0',    // Secondary text
        },
        neon: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
