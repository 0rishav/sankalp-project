/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        baloo: ['"Baloo 2"', 'cursive'],
        tiro: ['"Tiro Devanagari Hindi"', 'serif'],
        noto: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
