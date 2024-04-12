// todo: this when garbo adds what i asked for.
const addonAPI = require('../api');

const addonID = 'Ashimee';
module.exports = (function(addonData) {
  
  function setup() {
    
  }
  function main() {}

  return {
    name: 'Extension loading error catcher.', id: addonID,
    description: 'Catches errors when extensions load.',
    lastupdate: '04/11/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})(addonAPI.getData(addonID));