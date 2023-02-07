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
        purple: {
          500: "#5A6FDB"
        },
        blue: {
          500: "#63C1DF"
        }
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};
