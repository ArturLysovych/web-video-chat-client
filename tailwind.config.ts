import type { Config } from 'tailwindcss';

const tailwindConfig: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        normalSky: '#38bdf8',
        semiboldSky: '#0ea5e9',
        boldSky: '#0369a1'
      }
    },
  },
  plugins: [],
};

export default tailwindConfig;
