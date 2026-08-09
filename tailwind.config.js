/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FAF6EF",
        sand: "#EFE6D8",
        espresso: "#3A2A1D",
        bark: "#2A1D14",
        caramel: "#A8734A",
        clay: "#8C5A34",
        ink: "#1B140E",
        line: "#E3D6C1",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(58, 42, 29, 0.10)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
