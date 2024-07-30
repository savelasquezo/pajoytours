import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        samiya: ['MikeSamiya', 'sans'],
        animeace: ['Animeace', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        courier: ['Courier', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        comicsanseu: ['ComicNeueSansID', 'sans-serif'],
      },
      backgroundImage: {
        'background-image01': "url('/assets/demo/background01.webp')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        pajoy0: '#2b235a',
        pajoy1: '#F20C60',
        pajoy2: '#13F2DC',
        pajoy3: '#F2E30C',
        pajoy4: '#650000',
      },
    },
  },
  plugins: []
}

export default config
  