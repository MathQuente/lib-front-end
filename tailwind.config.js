/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        nesthub: { raw: '(max-width: 1024px) and (max-height: 600px)' },
        asus: { raw: '(min-width: 1071px) and (max-height: 695px)' }
      },
      transitionProperty: {
        width: 'width'
      }
    }
  },
  plugins: []
}
