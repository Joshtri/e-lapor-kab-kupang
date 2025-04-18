/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind');

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',

    flowbite.content(),
  ],
  darkMode: 'class', // ✅ penting untuk next-themes

  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
