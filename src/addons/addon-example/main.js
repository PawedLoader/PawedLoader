const addonAPI = require('../api');

const addonID = 'AshimeesExample';
module.exports = (function(addonData) {
  
  function setup() {
    addonData['cool'] = true;
    console.log('Wow!');
  }
  function main() {}

  return {
    name: 'Example - Mhm', id: addonID,
    description: 'a very cool addon!',
    lastupdate: '04/05/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})(addonAPI.getData(addonID));