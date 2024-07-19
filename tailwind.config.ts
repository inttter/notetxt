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
    },
  },
  variants: {},
  plugins: [require("daisyui"), require('@tailwindcss/typography')],
  daisyui: {
    themes: ["dark", "lofi", "black"],
  },
}
