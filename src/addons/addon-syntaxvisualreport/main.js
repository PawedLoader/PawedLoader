const addonID = 'AshimeeHighlightedVisualReport';
module.exports = (function() {
  
  let addonAPI, addonData = {};
  async function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
    const highlighter = api.requireProp('highlighter');
    const vm = await api.getVM();
    api.getBlockly().then((Blockly) => {
      Blockly.WorkspaceSvg.prototype.reportValueHTML = function(id, html) {
        // This function is based on https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_svg.js#L1088
        const block = this.getBlockById(id);
        if (!block) {
          throw 'Tried to report value on block that does not exist.';
        }
        Blockly.DropDownDiv.hideWithoutAnimation();
        Blockly.DropDownDiv.clearContent();
        const contentDiv = Blockly.DropDownDiv.getContentDiv();
        const valueReportBox = document.createElement('div');
        valueReportBox.setAttribute('class', 'valueReportBox');
        valueReportBox.innerHTML = html;
        contentDiv.appendChild(valueReportBox);
        Blockly.DropDownDiv.setColour(
          Blockly.Colours.valueReportBackground,
          Blockly.Colours.valueReportBorder
        );
        Blockly.DropDownDiv.showPositionedByBlock(this, block);
      };
      const rvr = vm.runtime.visualReport;
      function isMalf(value) {
        if (value === undefined) return true;
        if (value === null) return true;
        if (value === '') return true;
      }
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
          if (require('../../utils/isJSON')(value)) {
            html = highlighter.highlight(value, {language: 'json'}).value;
          } else if(require('../../utils/isXML')(value)) {
            html = highlighter.highlight(value, {language: 'xml'}).value;
          } else {
            if ((Number(value) !== NaN) || value == 'true' || value == 'false' || value == 'NaN') {
              html = highlighter.highlight(value, {language: 'javascript'}).value;
            }
          }
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
      }
    });
  }

  return {
    name: 'Syntax Highlighted Visual Report', id: addonID,
    description: 'Adds syntax highlighting to the visual report box!',
    lastupdate: '06/04/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();