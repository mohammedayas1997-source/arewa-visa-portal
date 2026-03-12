/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true, 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003366",
          light: "#0d6efd",
        },
        secondary: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, 
  },
};