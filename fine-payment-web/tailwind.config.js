/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d9f0ff",
          300: "#91d7ff",
          500: "#2ba9ff",
          700: "#0a6fb4",
          900: "#0a3250"
        }
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"]
      },
      boxShadow: {
        panel: "0 12px 30px rgba(10, 50, 80, 0.15)"
      }
    }
  },
  plugins: []
};
