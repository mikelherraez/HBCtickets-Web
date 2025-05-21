/** tailwind.config.js */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent:  '#ef4444',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        spinSlow: 'spinSlow 10s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/typography'),
  require('@tailwindcss/aspect-ratio'),
  ],
};
