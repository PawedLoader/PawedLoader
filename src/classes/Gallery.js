const Tab = require('./Tab');

module.exports = class Gallery extends Tab {
  constructor(body, galleryName) {
    super(body);
    this.body = body;
    this.galleryName = galleryName;
    this.extensions = [];
    this._tempExtensions = [];
    this.node = document.createElement('span');
    this.node.textContent = 'Constructing gallery, please be patient.';
    this._refreshingGallery = false;
  }
  _cleanExtensionDescription(description) {
    return description;
  }
  _makeExtension(extension) {
    const node = document.createElement('div');
    node.setAttribute('paw-for', 'extension');
    const imageWrapper = document.createElement('div');
    const image = document.createElement('img');
    image.src = extension.imageURL;
    image.alt = `Thumbnail for "${extension.title}".`;
    imageWrapper.appendChild(image);
    imageWrapper.setAttribute('paw-for', 'extension-thumbnail');
    const title = document.createElement('h5');
    title.textContent = extension.title;
    title.setAttribute('paw-for', 'extension-title');
    const credits = document.createElement('div');
    credits.setAttribute('paw-for', 'extension-credits-outer');
    const descriptionWrapper = document.createElement('div');
    const description = document.createElement('p');
    description.textContent = extension.description;
    descriptionWrapper.appendChild(description);
    credits.setAttribute('paw-for', 'extension-description');
    node.appendChild(imageWrapper);
    node.appendChild(title);
    node.appendChild(descriptionWrapper);
    node.appendChild(credits);
    return node;
  }
  addExtension(extension) {
    extension.description = this._cleanExtensionDescription(extension.description);
    this.extensions.push(extension)
  }
  addExtensions(extensions) {
    extensions.forEach(extension => this.addExtension(extension));
  }
  async makeGallery() {
    const node = document.createElement('div');
    node.setAttribute('paw-for', 'ext-gallery-wrapper-outer');
    const header = document.createElement('h3');
    const galleryWrapper = document.createElement('div');
    galleryWrapper.setAttribute('paw-for', 'ext-gallery-wrapper-inner');
    this.extensions.forEach(extension => {
      galleryWrapper.appendChild(this._makeExtension(extension));
    });
    header.textContent = `${this.galleryName.toLowerCase()}'s Gallery`;
    header.setAttribute('paw-for', 'ext-gallery-title');
    node.appendChild(header);
    node.appendChild(galleryWrapper);
    this.node.appendChild(node);
  }
  async constructNode() {} // For the user to override.
  async constructGalleryNode() {
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh this gallery';
    refreshButton.onclick = async (event) => {
      this._refreshingGallery = true;
      await this.makeGallery();
    }
    if (this.disableRefresh) refreshButton.style.display = 'none';
    this.node.innerHTML = '';
    this.node.appendChild(refreshButton);
    await this.makeGallery();
  }
  get getNode() {
    this.node.innerHTML = '';
    this.constructGalleryNode(); // Should append the gallerys after :thinking:
    this.constructNode();
    return this.node;
  }
}