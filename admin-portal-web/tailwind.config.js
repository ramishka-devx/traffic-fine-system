/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brass: {
          50: "#fff8e7",
          100: "#ffefc5",
          300: "#f8cd70",
          500: "#de9d2f",
          700: "#9b6816",
          900: "#4c340c"
        }
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Noto Sans", "sans-serif"]
      },
      boxShadow: {
        panel: "0 14px 36px rgba(76, 52, 12, 0.15)"
      }
    }
  },
  plugins: []
};
