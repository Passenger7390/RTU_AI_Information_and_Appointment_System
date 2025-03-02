module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
        customcolor: "#ff3366",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
