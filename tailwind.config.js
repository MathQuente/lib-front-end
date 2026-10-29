/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        nesthub: { raw: '(max-width: 1024px) and (max-height: 600px)' },
        asus: { raw: '(min-width: 1071px) and (max-height: 695px)' },
      },
      zIndex: {
        confirm: '60',
        'confirm-content': '70',
      },
      transitionProperty: {
        width: 'width',
      },
      fontFamily: {
        display: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      keyframes: {
        'wall-slide': {
          to: { transform: 'translateX(-50%)' },
        },
        'cursor-blink': {
          '50%': { opacity: '0' },
        },
        'swap-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'wall-slide': 'wall-slide 90s linear infinite',
        'cursor-blink': 'cursor-blink 1s steps(2, jump-none) infinite',
        'swap-in': 'swap-in 250ms ease-out',
      },
      colors: {
        primary: {
          DEFAULT: '#7A38CA',
          light: '#9D52E8',
          hover: '#8B47DB',
          'hover-light': '#AE63F9',
        },
        dark: {
          bg: '#1A1C26',
          'bg-light': '#1F2029',
          'bg-lighter': '#25262F',
          'bg-darker': '#0F1117',
          card: '#181920',
          border: '#2A2B36',
        },
      },
      textColor: {
        primary: '#7A38CA',
        'primary-light': '#9D52E8',
        'primary-link': '#B88AF2',
      },
      backgroundColor: {
        primary: '#7A38CA',
        'primary-light': '#9D52E8',
        'primary-hover': '#8B47DB',
      },
    },
  },
  plugins: [],
}
