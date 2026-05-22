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
        // Color dinámico del panel (no tocar — lo usa Configuración)
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "#ffffff",
        },
        // ── Identidad pública Excelsa (editorial cálido) ──
        excelsa: {
          navy:   "#002366", // color principal de marca
          navy2:  "#0B2E73", // azul algo más claro para hovers / capas
          ink:    "#1A1611", // tinta cálida (texto)
          cream:  "#FAF6EF", // base marfil
          sand:   "#F1E8DA", // arena (secciones alternas)
          sand2:  "#E7DAC6", // arena más profunda / bordes
          clay:   "#C15F3C", // acento terracota
          clay2:  "#A84B2B", // terracota oscuro (hover)
          claysoft: "#E9C9B4", // terracota lavado (fondos suaves)
        },
      },
      fontFamily: {
        // Tipografía pública. El panel sigue usando Inter (en <body>).
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
