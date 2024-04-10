const minilog = require('./utils/minilog');
const vm = require('./defs').vm;
const GUI = require('./gui');
GUI.setup();
vm.paw = GUI;
GUI.addons.load();
minilog.log('Loaded.');