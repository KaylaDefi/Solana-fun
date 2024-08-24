/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff007a', // Vibrant pink
        secondary: '#00bcd4', // Cool cyan
        background: '#1a1a1a', // Dark background
        surface: '#2c2c2c', // Darker surface
        accent: '#ffeb3b', // Bright yellow accent
      },
      fontFamily: {
        sans: ['"Roboto Condensed"', 'sans-serif'], // Edgy, condensed font
        mono: ['"Fira Code"', 'monospace'], // Monospaced font for code-like style
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '128': '32rem', // Custom spacing for large padding/margin
        '144': '36rem',
      },
    },
  },
  plugins: [],
};
