const addonID = 'AshimeesExample';
module.exports = (function() {
  
  let addonAPI, addonData = {};
  function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
  }

  return {
    name: 'Example - Mhm', id: addonID,
    description: 'a very cool addon!',
    lastupdate: '04/05/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();