/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Na gyara wannan kalar zuwa Navy Blue din da kake amfani da shi a Navbar
        primary: {
          DEFAULT: "#003366",
          light: "#0d6efd",
        },
        secondary: "#dc2626", // Red din AVA
      },
      // Mun kara wadannan domin tabbatar da cewa fonts da sauran abubuwa sun zauna
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
