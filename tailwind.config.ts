// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Habilita el modo oscuro por clases
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ahora 'primary' usará nuestra variable de globals.css
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
export default config;