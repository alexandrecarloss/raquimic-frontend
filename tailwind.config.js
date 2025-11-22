/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    "w-0",
    "w-56",
    "overflow-hidden"
  ],
  theme: { extend: {} },
  plugins: [],
}
