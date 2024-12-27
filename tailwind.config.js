/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        nesthub: { raw: '(max-width: 1024px) and (max-height: 600px)' },
      },
    }
  },
  plugins: []
}
