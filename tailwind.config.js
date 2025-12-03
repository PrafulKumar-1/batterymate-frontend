/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      // Line 8-15: Custom colors
      colors: {
        primary: '#10b981',
        secondary: '#3b82f6'
      },
      // Line 16-20: Custom spacing
      spacing: {
        '128': '32rem'
      }
    }
  },
  plugins: []
}
