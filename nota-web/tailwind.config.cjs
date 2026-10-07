module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        tan: '#C08552',
        brown: '#8C5A3C',
        espresso: '#4B2E2B'
      },
      fontFamily: {
        poppins:  Poppins sans-serif,
        inter: Inter sans-serif
      },
      borderRadius: {
        DEFAULT: '12px'
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
};
