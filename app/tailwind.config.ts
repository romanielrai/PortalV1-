import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#02061D',
        foreground: '#BDB6AC',
        gold: '#8E7D69',
        highlight: '#CFC7BA'
      },
      boxShadow: {
        glow: '0 25px 80px rgba(143,122,103,0.2)'
      },
      backgroundImage: {
        glass: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
