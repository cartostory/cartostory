module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'upload-button-loading':
          'upload-button-loading 0.96s infinite linear alternate, upload-button-loading-2 1.92s infinite linear',
      },
      keyframes: {
        'upload-button-loading': {
          '0%': {
            'clip-path':
              'polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)',
          },
          '12.5%': {
            'clip-path':
              'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)',
          },
          '25%': {
            'clip-path':
              'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)',
          },
          '50%': {
            'clip-path':
              'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '62.5%': {
            'clip-path':
              'polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '75%': {
            'clip-path':
              'polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '100%': {
            'clip-path':
              'polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)',
          },
        },
        'upload-button-loading-2': {
          '0%': {
            transform: 'scaleY(1) rotate(0deg)',
          },
          '49.99%': {
            transform: 'scaleY(1) rotate(135deg)',
          },
          '50%': {
            transform: 'scaleY(-1) rotate(0deg)',
          },
          '100%': {
            transform: 'scaleY(-1) rotate(-135deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
