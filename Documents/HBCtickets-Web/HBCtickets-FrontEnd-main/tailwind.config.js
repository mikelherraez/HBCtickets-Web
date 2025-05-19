/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* --- tu identidad visual --- */
      colors: {
        primary: '#2563eb',   // azul corporativo
        accent:  '#ef4444',   // rojo para avisos / CTA
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card:  '0 4px 12px rgba(0,0,0,.08)',
        card2: '0 8px 24px rgba(0,0,0,.16)',
      },
      borderRadius: {
        '4xl': '2rem',
      },

      /* --- animación soft --- */
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '.6' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
