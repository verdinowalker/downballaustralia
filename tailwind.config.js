/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0B0B0B',
          gold: '#D4AF37',
          white: '#FFFFFF'
        }
      }
    }
  },
  plugins: []
}
