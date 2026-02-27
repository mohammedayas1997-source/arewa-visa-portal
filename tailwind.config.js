/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true, // Wannan zai tilasta wa Tailwind classes su yi aiki ba tare da sun hargitsa Bootstrap ba
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
    preflight: false, // WANNAN SHINE MAGANIN HARGTSEWA - Zai hana Tailwind goge adon Bootstrap
  },
};
