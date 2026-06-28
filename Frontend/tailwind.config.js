/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Google Sans",
          "Google Sans Text",
          "Product Sans",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        rust: "#bb3e00",
        amber: "#f7ad45",
        olive: "#7b6f19",
        cream: "#fff1d7",
        ink: "#261406",
      },
    },
  },
  plugins: [],
};

