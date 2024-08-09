module.exports = {
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}', 
    './src/pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
      },
      colors: {
        'danger': '#F0243C',
        'dark': '#101010'
      }
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
}
