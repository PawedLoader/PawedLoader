// Just some plain css
let css = `
/* css will go here */
`;
// Add an way to interface with the variable above
module.exports = {
  get() {
    return css;
  },
  set(styles) {
    css = styles;
  }
};