const IndexedDBsimple = require('./classes/IndexedDBSimple');
const DB = new IndexedDBsimple();
DB.setDBName('PawedLoader');
module.exports = DB;