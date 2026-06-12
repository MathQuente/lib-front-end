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
      },
      colors: {
        primary: {
          DEFAULT: '#7A38CA',
          light: '#9D52E8',
          hover: '#8B47DB',
          'hover-light': '#AE63F9'
        },
        dark: {
          bg: '#1A1C26',
          'bg-light': '#1F2029',
          'bg-lighter': '#25262F',
          'bg-darker': '#0F1117',
          card: '#181920',
          border: '#2A2B36'
        }
      },
      textColor: {
        primary: '#7A38CA',
        'primary-light': '#9D52E8'
      },
      backgroundColor: {
        primary: '#7A38CA',
        'primary-light': '#9D52E8'
      }
    }
  },
  plugins: []
}
