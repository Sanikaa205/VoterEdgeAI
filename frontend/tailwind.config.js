/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A56DB",
          dark: "#1C3F9C",
        },
        accent: "#0E9F6E",
        neutral: {
          900: "#111928",
          700: "#374151",
          500: "#6B7280",
          100: "#F3F4F6",
        },
      },
    },
  },
  plugins: [],
}

