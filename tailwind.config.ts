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
        'confirm': '#166534',
        'destructive': '#F0243C',
        'default': '#282828',
        'dark': '#101010',
      }
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
}
