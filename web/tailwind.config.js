/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        test: {
          200: "#fff",
          500: "#ff0000",
          800: "#6e0f07"
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};
