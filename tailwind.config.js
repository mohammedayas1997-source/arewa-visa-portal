/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Mun kara tabbatar masa ya duba folder pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // Da folder components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d6efd", // Wannan zai taimaka wa blue bar din dake Navbar dinka
      },
    },
  },
  plugins: [],
};
