/** @type {import('tailwindcss').Config} */
import { blackA, violet } from '@radix-ui/colors'
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet
      }
    }
  },
  plugins: []
}
