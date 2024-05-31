const Tab = require('../../classes/Tab');
const Gallery = require('../../classes/Gallery');

module.exports = class MyTab extends Tab {
  constructor(props) {
    super(props);
    const body = props.body;
    this.DB = body.props.DB;
    this.node = document.createElement('span');
    return this.node; // for now due to alex accidentilly breaking it with his CSS :((
    this._refreshingGallerys = false;
    this._deleteGallery(true);
    this.galleryURLS = {
      'ashime': 'https://surv.is-a.dev/survs-gallery/',
      'sharkpool': 'https://sharkpool-sp.github.io/SharkPools-Extensions/Gallery%20Files/Extension-Keys.json',
    };
    this.galleryMakers = {};
  }
  get header() {
    const node = document.createElement('div');
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh gallerys';
    refreshButton.onclick = async (event) => {
      this._refreshingGallerys = true;
      await this._makeGallerys();
    }
    node.appendChild(refreshButton);
    this.headerNode = node;
    return node;
  }
  _deleteGallery(overwrite) {
    try {
      this.gallerys.remove();
      this.headerNode.remove();
    } catch {} finally {
      if (overwrite ?? false) this.gallerys = document.createElement('div');
    }
  }
  async _makeGallerys() {
    this._refreshingGallerys = this._refreshingGallerys || !await this.DB.readFromDatabase('gallerysJSON');
    this._deleteGallery(true);
    for (const galleryName of Object.keys(this.galleryURLS)) {
      const gallery = await this._refreshGallery(galleryName, this._refreshingGallerys);
      this.gallerys.appendChild(gallery.getNode);
    }
    this._refreshingGallerys = false;
    this._deleteGallery(false);
    this.node.appendChild(this.header);
    this.node.appendChild(this.gallerys);
  }
  async _refreshGallery(galleryName, refetch) {
    const DB = this.DB;
    const api = this.galleryURLS[galleryName];
    let galleryResponse = '';
    if (refetch) await (new Promise(async (resolve, reject) => {
      fetch(api).then(async (value) => {
        galleryResponse = await value.text();
        const currentJSON = JSON.parse(await DB.readFromDatabase('gallerysJSON') ?? '{}');
        currentJSON[galleryName] = galleryResponse;
        await DB.writeToDatabase('gallerysJSON', JSON.stringify(currentJSON));
        resolve(galleryResponse);
      }).catch((reason) => reject(reason));
    }));
    if (!galleryResponse) galleryResponse = JSON.parse(await DB.readFromDatabase('gallerysJSON'))[galleryName];
    let galleryData, galleryExtensions,
        hostReplacer = `${document.location.protocol}//${document.location.host}`;
    switch(galleryName) {
      case 'sharkpool':
        galleryData = JSON.parse(galleryResponse)['extensions'];
        galleryExtensions = Object.entries(galleryData).filter(([extensionID]) => (
          extensionID !== 'Example'
        )).map(([extensionID, extensionData]) => ({
            title: extensionID,
            url: extensionData.url,
            description: extensionData.credits,
            credits: [],
            imageURL: `https://sharkpool-sp.github.io/SharkPools-Extensions/extension-thumbs/${extensionID}.svg`,
        }));
        break;
      case 'ashime':
        galleryData = new DOMParser().parseFromString(galleryResponse, 'text/html');
        galleryExtensions = ((function() {
          const extensions = Array.from(galleryData.querySelectorAll('.extension')).filter(ext => (ext.style.display ?? '') !== 'none');
          return extensions.map(extension => {
            return {
              title: extension.querySelector('h3').textContent,
              description: extension.querySelector('p').textContent,
              imageURL: 'https://surv.is-a.dev/survs-gallery'+extension.querySelector('img[class*="extension-image"]').src.replace(hostReplacer, ''),
              url: 'https://surv.is-a.dev/survs-gallery'+extension.querySelector('button').dataset.url.replace(hostReplacer, ''),
              credits: (Array.from((extension.querySelector('div[class*="credit-box"] > div[class*="extension-boxing-inner"]') ?? document.createElement('div')).querySelectorAll('a')).map(user => ({url: user.href, name: user.textContent})))
            }
          });
        })());
        break;
    }
    const gallery = new Gallery(this.body, galleryName);
    gallery.disableRefresh = true;
    this.galleryMakers[galleryName] = gallery;
    gallery.addExtensions(galleryExtensions);
    return gallery;
  }
  get getNode() {
    this.node.innerHTML = 'WIP';
    return this.node; // for now due to alex accidentilly breaking it with his CSS :((
    this._deleteGallery(false);
    this._makeGallerys();
    return this.node;
  }
}