module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dog-bg': '#FFFFFF', // White
        'dog-main': '#DBC8B6', // Milk Tea Beige
        'dog-accent': '#F08A76', // Coral Salmon
        'dog-text': '#5C4B43', // Coffee Brown
        'dog-border': '#EFE5DA', // Light Sand

        // Aliases for backward compatibility or semantic usage
        'dog-primary': '#F08A76', // Mapped to Accent (Coral Salmon) as it was used for primary actions
        'dog-secondary': '#DBC8B6', // Mapped to Main (Beige)

        'paw-brown': '#8D6E63', // Keeping original brown as a reserve or specific brown
        'grass-green': '#4CAF50',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Will add link in index.html later
      },
    },
  },
  plugins: [],
}
