/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    "w-0",
    "w-56",
    "overflow-hidden",
    "transition-all",
    "duration-300",
    "z-50",
    "bg-gray-900",
    "px-3",
    "py-2"
  ],
  theme: { extend: {} },
  plugins: [],
}
