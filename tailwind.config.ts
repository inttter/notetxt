module.exports = {
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}', 
    './src/pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        'ia-quattro': ['var(--font-ia-quattro)', 'sans-serif'],
      },
      colors: {
        'confirm': '#166534',
        'destructive': '#EF4444',
        'primary': '#5577f2',
        'primary-text': '#94a8f2',
        'dark': '#121215',
        'dark-button-hover': '#212127',
        'dark-secondary': '#151519',
        'dark-button': '#1b1b1f',
        'dark-focus': '#1d1e23'
      }
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
    },
    animation: {
      "slideDown": 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      "slideUp": 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      "spin": 'spin 1s linear infinite',
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")],
}
