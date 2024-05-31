let fileGroupBar, buttonHoverClasses;

function refreshNodes() {
  // Fetch the navbar and element for where we get the classes to copy
  fileGroupBar = document.querySelector('[class^=menu-bar_file-group]');
  buttonHoverClasses = fileGroupBar.querySelector('[class^=menu-bar_menu-bar-item]');
}
refreshNodes();

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
    // Refresh some of the nodes as they may be null or outdated
    // (like if you open or close the editor they are remade internally by react, so they become outdated)
    refreshNodes();
    // This is used as our base node
    const newButton = document.querySelector('div[class^=menu-bar_menu-bar-item]').cloneNode(true);
    this.node = newButton;
    this.isDropdown = isDropdown ?? false;
    this.image = image ?? undefined;
    // Add the button to the navbar and hide it
    fileGroupBar.appendChild(newButton);
    this.hide();
    // Get the images in the newButton
    const images = newButton.querySelectorAll('img');
    // If this is not a dropdown we can just remove the dropdown image
    if (!this.isDropdown) {
      images[1].remove();
      newButton.querySelector('div[class^=menu-bar_menu-bar-menu]').remove();
    }
    // If there is no image just remove it outright
    if (!this.image) images[0].remove();
    // Now we can set the label to our HTML
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