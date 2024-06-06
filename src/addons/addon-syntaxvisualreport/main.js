const addonID = 'AshimeeBetterVisualReport';
module.exports = (function() {
  
  let addonAPI, addonData = {};
  async function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
    const xmlEscape = require('../../utils/xmlEscape');
    const vm = await api.getVM();
    function recallRvr(...args) {
      // `this` is Blockly.mainWorkspace
      return vm.runtime.visualReport(...args);
    }
    // Syntax highlighting for visual reports
    // Todo: do a check to see if highlighter is enabled
    if (true) {
      const highlighter = api.requireProp('highlighter');
      function isMalf(value) {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === '') return true;
      }
      api.getBlockly().then((Blockly) => {
        const rvr = vm.runtime.visualReport;
        vm.runtime.visualReport = function(...args) {
          const [id, valInit] = args;
          let value = valInit ?? null;
          const ws = Blockly?.getMainWorkspace?.();
          if (id && !isMalf(value) && ws) {
            let html = '';
            if (typeof value === 'object') {
              try {
                value = JSON.stringify(value);
              } catch {
                value = '';
              }
            }
            value = String(value);
            const cValue = value.toLowerCase(); // Used for comparisons
            if (cValue == 'infinity' || cValue == 'nan') {
              html = `<span class="highlighter-purple">${xmlEscape(value)}</span>`;
            } else if (cValue == 'null') {
              html = `<span class="highlighter-null">${xmlEscape(value)}</span>`;
            } else if (cValue == 'undefined') {
              html = `<span class="highlighter-gray">${xmlEscape(value)}</span>`;
            } else if ((Number(cValue) !== NaN) || cValue == 'true' || cValue == 'false') {
              html = highlighter.highlight(value, {language: 'javascript'}).value;
            } else if (require('../../utils/isJSON')(value)) {
              html = highlighter.highlight(value, {language: 'json'}).value;
            } else if (require('../../utils/isXML')(value)) {
              html = highlighter.highlight(value, {language: 'xml'}).value;
            } else return rvr.apply(this, args);
            if (html && !isMalf(value)) {
              ws.reportValueHTML(id, html);
              Blockly.DropDownDiv.DIV_.classList.add('highlighter');
              return true;
            }
          } else {
            if (!ws) console.warn('Unable to get workspace for visual report.');
            if (!id) console.warn('Tried to report value on a block that does not exist.');
            if (!value) console.warn('Recived empty value in visual report.');
          }
          return rvr.apply(this, args);
        };
      });
    }
    // Fancy visual reports
    // Todo: do a check to see if this is enabled
    if (true) {
      api.getBlockly().then((Blockly) => {
        const rvr = vm.runtime.visualReport;
        vm.runtime.visualReport = function(...args) {
          const [id, value] = args;
          const ws = Blockly?.getMainWorkspace?.();
          if (ws && typeof value == 'string') {
            if (value.startsWith('https://') || value.startsWith('http://')) {
              ws.reportValueHTML(id, `<a href="#">${xmlEscape(value)}</a>`); // DO NOT- Add the link in the HTML part
              Blockly.DropDownDiv.DIV_.querySelector('a').onclick = async () => {
                if (false) window.open(value, '_blank');
              }; // We do it here as its safe :yawn:
              return true;
            }
          }
          return rvr.apply(this, args);
        };
      });
    }
    // Long visual report check
    // Todo: do a check to see if this is enabled
    if (true) {
      api.getBlockly().then((Blockly) => {
        const rvr = vm.runtime.visualReport;
        vm.runtime.visualReport = function(...args) {
          const [id, value] = args;
          const ws = Blockly?.getMainWorkspace?.();
          if (!ws) return rvr.apply(this, args);
          const skipSizeCheck = ws.__$pawAddons_skipVisualReportSizeCheck ?? false;
          if (skipSizeCheck) {
            ws.__$pawAddons_skipVisualReportSizeCheck = false;
            return rvr.apply(this, args);
          }
          if (typeof value == 'string' && value.length > 10000) {
            return ws.reportValueSize(id, value, 10000, recallRvr);
          }
          return rvr.apply(this, args);
        };
      });
    }
  }

  return {
    name: 'Better visual reports', id: addonID,
    description: 'Adds lots of new features to visual reports!',
    lastupdate: '06/04/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();