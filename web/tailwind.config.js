/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          300: "#63C1DF",
          700: "#5A6FDB",
          800: "#4459be"
        }
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")
  ],
};
