const Tab = require('../../classes/Tab');
const DB = require('../../db');

module.exports = class MyTab extends Tab {
  constructor(body) {
    super(body);
    this.node = document.createElement('span');
    this.node.textContent = `${body.tabNumber} : ${body.tabPath}`;
    this._refreshingGallerys = false;
    this.gallerys = document.createElement('div');
    this.galleryURLS = {
      'ashime': 'https://surv.is-a.dev/survs-gallery/',
      'sharkpool': 'https://sharkpool-sp.github.io/SharkPools-Extensions/Gallery%20Files/Extension-Keys.json',
    }
  }
  async constructNode() {
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Gallerys';
    refreshButton.onclick = async (event) => {
      this._refreshingGallerys = true;
      await this._makeGallerys();
    }
    this.node.innerHTML = '';
    this.node.appendChild(refreshButton);
    await this._makeGallerys();
  }
  async _makeGallerys() {
    if (this.gallerys) this.gallerys.remove();
    this.gallerys = document.createElement('div');
    let skipConstruct = false;
    if (await DB.readFromDatabase('gallerysJSON') === null) {
      this.gallerys.innerHTML = '';
      this.gallerys.appendChild(document.createTextNode('Refresh the gallerys as they have not yet been loaded in!'));
      skipConstruct = true;
    }
    for (const galleryName of Object.keys(this.galleryURLS)) {
      if (this._refreshingGallerys) {
        await this._refreshGallery(galleryName);
      }
      if (!skipConstruct) this.gallerys.appendChild(await this._constructGallery(galleryName));
    }
    this._refreshingGallerys = false;
    try {
      this.gallerys.remove();
    } catch {} finally {
      this.node.appendChild(this.gallerys);
    }
  }
  async _constructGallery(galleryName) {
    const gallery = JSON.parse(await DB.readFromDatabase('gallerysJSON'))[galleryName];
    const node = document.createElement('div');
    node.setAttribute('paw-for', 'ext-gallery-wrapper-outer');
    const header = document.createElement('h3');
    const galleryWrapper = document.createElement('div');
    galleryWrapper.setAttribute('paw-for', 'ext-gallery-wrapper-inner');
    header.textContent = `${galleryName.toLowerCase()}'s Gallery`;
    header.setAttribute('paw-for', 'ext-gallery-title');
    node.appendChild(header);
    let data, hostReplacer = `${document.location.protocol}//${document.location.host}`;
    switch(galleryName) {
      case 'sharkpool':
        data = JSON.parse(gallery)['extensions'];
        Object.entries(data).forEach(([extensionID, extensionData]) => {
          if (extensionID === 'Example') return;
          galleryWrapper.appendChild(this._makeExtension({
            title: extensionID,
            url: extensionData.url,
            description: this._cleanExtensionDescription(extensionData.credits),
            credits: [],
            imageURL: `https://sharkpool-sp.github.io/SharkPools-Extensions/extension-thumbs/${extensionID}.svg`,
          }));
        });
        break;
      case 'ashime':
        data = new DOMParser().parseFromString(gallery, 'text/html');
        ((function() {
          const extensions = Array.from(data.querySelectorAll('.extension')).filter(ext => (ext.style.display ?? '') !== 'none');
          return extensions.map(extension => {
            return {
              title: extension.querySelector('h3').textContent,
              description: extension.querySelector('p').textContent,
              imageURL: 'https://surv.is-a.dev/survs-gallery'+extension.querySelector('img[class*="extension-image"]').src.replace(hostReplacer, ''),
              url: 'https://surv.is-a.dev/survs-gallery'+extension.querySelector('button').dataset.url.replace(hostReplacer, ''),
              credits: (Array.from((extension.querySelector('div[class*="credit-box"] > div[class*="extension-boxing-inner"]') ?? document.createElement('div')).querySelectorAll('a')).map(user => ({url: user.href, name: user.textContent})))
            }
          });
        })()).forEach(extension => {
          galleryWrapper.appendChild(this._makeExtension(extension));
        });
        break;
    }
    node.appendChild(galleryWrapper);
    return node;
  }
  async _refreshGallery(galleryName) {
    const api = this.galleryURLS[galleryName];
    await (new Promise(async (resolve, reject) => {
      fetch(api).then(async (value) => {
        const data = await value.text();
        const currentJSON = JSON.parse(await DB.readFromDatabase('gallerysJSON') ?? '{}');
        currentJSON[galleryName] = data;
        await DB.writeToDatabase('gallerysJSON', JSON.stringify(currentJSON));
        resolve(data);
      }).catch((reason) => reject(reason));
    }));
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
  _cleanExtensionDescription(description) {
    return description;
  }
  get getNode() {
    this.node.innerHTML = '';
    this.constructNode(); // Should append the gallerys after :thinking:
    return this.node;
  }
}