/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        inriaSans: ['"Inria Sans"', 'sans-serif'],
        Aladin: ['"Aladin"', 'sans-serif'],
        dosis: ['"Dosis"', 'sans-serif'],
        junge: ['"Junge"', 'serif'],
      },
    },
  },
  plugins: [],
}
