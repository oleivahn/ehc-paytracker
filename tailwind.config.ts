import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      {
        oxTheme: {
          primary: "#F87B41",
          secondary: "#9792db",
          accent: "#4df9da",
          neutral: "#25242e",
          "base-100": "#fcfcfd",
          info: "#76b7db",
          success: "#115544",
          warning: "#eea858",
          error: "#fb6851",
        },
      },
    ],
  },
};
export default config;
