/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fb",
        surface: "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        primary: "#000000",
        "primary-container": "#131b2e",
        secondary: "#006591",
        "secondary-container": "#39b8fd",
        "on-surface": "#191c1e",
        "on-surface-variant": "#45464d",
        outline: "#76777d",
        "outline-variant": "#c6c6cd",
        error: "#ba1a1a",
        "on-primary": "#ffffff"
      },
      borderRadius: {
        xl: "0.5rem"
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 16px 40px rgba(19, 27, 46, 0.08)"
      }
    }
  },
  plugins: []
};
