/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch,
     colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primaryNew:{
        100:"#A7ADF2"
      },

    },
  },
    
  },
  plugins: [],
};
