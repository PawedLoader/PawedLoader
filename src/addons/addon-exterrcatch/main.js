// todo: this when garbo adds what i asked for.
const addonID = 'Ashimee';
module.exports = (function() {

  let addonAPI, addonData = {};
  function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
  }

  return {
    name: 'Extension loading error catcher.', id: addonID,
    description: 'Catches errors when extensions load.',
    lastupdate: '04/30/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();