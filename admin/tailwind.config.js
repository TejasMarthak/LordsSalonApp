export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        slate: {
          50: "#f8fafc",
          400: "#cbd5e1",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        amber: {
          600: "#d97706",
          700: "#b45309",
        },
      },
    },
  },
  plugins: [],
};
