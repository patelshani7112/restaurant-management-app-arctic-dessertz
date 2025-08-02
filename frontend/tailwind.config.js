/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line ensures .ts and .tsx files are scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
