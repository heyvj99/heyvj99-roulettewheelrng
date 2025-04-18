/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "casino-gold": "#FFD700",
        "casino-red": "#b22222",
        "casino-green": "#006400",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      boxShadow: {
        casino: "0 0 20px rgba(255, 215, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
