module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#009FB7',
      'yellow': '#FFD970',
      'gray-dark': '#272727',
      'gray': '#696773',
      'gray-light': '#EFF1F3',
      'gray-medium': '#d0d6dc',
      'white': '#FFFFFF',
      'green': '#52b788',
      'green-light': '#d8f3dc',
      'green-dark': '#2d6a4f',
      'red': '#f94144',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [],
}
