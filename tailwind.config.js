/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto-mono)'],
        mono: ['var(--font-roboto-mono)'],
        roboto: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
} 