module.exports = {
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}', 
    './src/pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "lofi"],
  },
}
