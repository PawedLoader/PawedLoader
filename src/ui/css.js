let css = `
/* css will go here */
`;
module.exports = {
  get() {
    return css;
  },
  set(styles) {
    css = styles;
  }
};