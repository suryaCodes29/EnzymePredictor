module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 25px 80px rgba(56,189,248,0.16)",
      },
      backgroundImage: {
        "space-gradient": "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), transparent 24%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
