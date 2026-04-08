import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(59, 130, 246, 0.24), 0 18px 48px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at top left, rgba(14, 165, 233, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.18), transparent 24%), linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 1))",
      },
    },
  },
  plugins: [],
};

export default config;

