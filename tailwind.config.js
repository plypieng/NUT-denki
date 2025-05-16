/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 長岡技術科学大学ブランドカラー
        'primary-nut-blue': '#0064B6',
        'primary-nut-blue-dark': '#0A4C8B',
        'accent-nut-red': '#D61920',
        'gray-100': '#F4F7FA',
        'gray-100-dark': '#1C1F24',
        'gray-900': '#111827',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
      ringColor: {
        'primary-nut-blue': 'rgb(0 100 182 / 0.2)',
        'accent-nut-red': 'rgb(214 25 32 / 0.7)',
      },
      boxShadow: {
        header: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
