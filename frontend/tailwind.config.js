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
        roomie: {
          bg: "#F8F9FA",
          surface: "#FFFFFF",
          dark: "#202124",
          darkSurface: "#303134",
          border: "#DADCE0",
          borderDark: "#3C4043",
          text: "#202124",
          muted: "#5F6368",
          mutedLight: "#BDC1C6",
          blue: "#1A73E8",
          blueHover: "#1557B0",
          blueLight: "#E8F0FE",
          red: "#EA4335",
          redLight: "#FCE8E6",
          yellow: "#FBBC04",
          yellowLight: "#FEF7E0",
          yellowText: "#7A4B04",
          green: "#34A853",
          greenDark: "#137333",
          greenLight: "#E6F4EA",
          greenBorder: "#CEEAD6",
        },
        brand: {
          50: '#E8F0FE',
          100: '#D2E3FC',
          500: '#1A73E8',
          600: '#1557B0',
          700: '#174EA6',
          900: '#0D3C61',
        }
      },
      borderRadius: {
        '2xl': '1rem',      /* 16px - Roomie signature card/button radius */
        '3xl': '1.5rem',    /* 24px - Roomie feature/step card radius */
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(60, 64, 67, 0.08)',
        'xs': '0 1px 3px 0 rgba(60, 64, 67, 0.15)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      }
    },
  },
  plugins: [],
}
