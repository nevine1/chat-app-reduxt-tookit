/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:{
          DEFAULT: "#00adb5" ,
          dark: "#99dee1",
          light: "rgb(153 222 225 / 20%)"
        }
      },
    }, 
  },
  plugins: [],
};
//#00adb5