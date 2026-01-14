import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37',
          blue: {
            DEFAULT: '#0F2847',
            dark: '#0A1A2F',
            light: '#1A3A5C',
          },
          accent: '#4A9EFF',
        },
        status: {
          green: '#22C55E',
          yellow: '#EAB308',
          red: '#EF4444',
          gray: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};

export default config;
