/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: "#0F172A",
          slate: "#1E293B",
          border: "#E2E8F0",
          bg: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#64748B",
        },
        dept: {
          water: "#2563EB",
          power: "#D97706",
          gas: "#EA580C",
          telecom: "#9333EA",
          sewage: "#0D9488",
          road: "#1E293B",
        }
      }
    },
  },
  plugins: [],
}
