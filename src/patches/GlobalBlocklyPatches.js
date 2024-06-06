function patch(Blockly) {
  function removeDropdown() {
    Blockly.DropDownDiv.hideWithoutAnimation();
    Blockly.DropDownDiv.clearContent();
  }
  function colorDropdown(block) {
    Blockly.DropDownDiv.setColour(
      Blockly.Colours.valueReportBackground,
      Blockly.Colours.valueReportBorder
    );
    Blockly.DropDownDiv.showPositionedByBlock(Blockly.getMainWorkspace(), block);
  }
  function getReportBlock(id) {
    const block = Blockly.getMainWorkspace().getBlockById(id);
    if (!block) {
      throw 'Tried to report value on block that does not exist.';
    }
    return block;
  }
  Blockly.WorkspaceSvg.prototype.reportValueHTML = function(id, html) {
    // This function is based on https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_svg.js#L1088
    const block = getReportBlock(id);
    removeDropdown();
    const contentDiv = Blockly.DropDownDiv.getContentDiv();
    const valueReportBox = document.createElement('div');
    valueReportBox.setAttribute('class', 'valueReportBox');
    valueReportBox.innerHTML = html;
    contentDiv.appendChild(valueReportBox);
    colorDropdown(block);
  };
  Blockly.WorkspaceSvg.prototype.reportValueConfirmYN = function(id, value, reportValue) {
    // This function is based on https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_svg.js#L1088
    const block = getReportBlock(id);
    removeDropdown();
    const contentDiv = Blockly.DropDownDiv.getContentDiv();
    const valueReportBox = document.createElement('div');
    const yesNoDiv = document.createElement('div');
    const separator = document.createElement('span');
    valueReportBox.innerHTML = '<b>This is a lot of data and may crash if you continue!</b>&nbsp;<i>Continue?</i>'
    const yes = document.createElement('span');
    const no = document.createElement('span');
    yes.textContent = 'yes';
    yes.style['text-shadow'] = '#00FF00 1px 0 10px';
    no.textContent = 'no';
    no.style['text-shadow'] = '#FF0000 1px 0 10px';
    separator.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
    yesNoDiv.appendChild(yes);
    yesNoDiv.appendChild(separator);
    yesNoDiv.appendChild(no);
    yes.onclick = () => {
      removeDropdown();
      reportValue.call(this, id, value);
    };
    no.onclick = () => removeDropdown();
    valueReportBox.appendChild(yesNoDiv);
    contentDiv.appendChild(valueReportBox);
    colorDropdown(block);
  };
  Blockly.WorkspaceSvg.prototype.reportValueSize = function(id, value, maxSize, reportValue) {
    // This function is based on https://github.com/TurboWarp/scratch-blocks/blob/develop/core/workspace_svg.js#L1088
    if (value.length < maxSize) return reportValue.call(id, value);
    const block = getReportBlock(id);
    removeDropdown();
    const contentDiv = Blockly.DropDownDiv.getContentDiv();
    const valueReportBox = document.createElement('div');
    valueReportBox.setAttribute('class', 'valueReportBox');
    valueReportBox.innerHTML = `${xmlEscape(value.slice(0, 8))}... <i>${value.length - 9}B left</i>`;
    valueReportBox.onclick = () => {
      removeDropdown();
      const warning = 'Are you sure you want to show 1MB+ characters?\nYour browser may crash and you might lose progress.';
      // The warning is hardcoded at 1 million characters as thats where it gets REALLY laggy.
      Blockly.getMainWorkspace().__$pawAddons_skipVisualReportSizeCheck = true;
      if (value.length < 1e6 || (value.length >= 1e6 && confirm(warning))) reportValue.call(this, id, value);
    };
    contentDiv.appendChild(valueReportBox);
    colorDropdown(block);
  };
}
module.exports = patch;