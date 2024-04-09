/**
 * Makes a button
 */
class MenuBarButton {
  /**
   * Constructor
   * @param {String} html
   * @param {String} image An image url, this is not required
   * @param {Boolean} isDropdown Weather or not this has a dropdown attached to it
   */
  constructor(html, image, isDropdown) {
    const newButton = document.querySelector('div[class^=menu-bar_menu-bar-item]').cloneNode(true);
    this.node = newButton;
    this.isDropdown = isDropdown ?? false;
    this.image = image ?? undefined;
    queries.fileGroupBar.appendChild(newButton);
    this.hide();
    const images = newButton.querySelectorAll('img');
    if (!this.isDropdown) {
      images[1].remove();
      newButton.querySelector('div[class^=menu-bar_menu-bar-menu]').remove();
    }
    if (!this.image) images[0].remove();
    this.setLabel(html);
  }

  /**
   * Sets the label to the specified HTML
   * @param {String} html The HTML of the label
   */
  setLabel(html) {
    this.node.querySelector('span[class^=settings-menu_dropdown-label]').innerHTML = html;
  }

  /**
   * Shows the button
   */
  show() {
    this.node.style.display = '';
  }

  /**
   * Hides the button
   */
  hide() {
    this.node.style.display = 'none';
  }

  /**
   * Removes the button
   */
  remove() {
    this.node.remove();
  }
}
module.exports = MenuBarButton;