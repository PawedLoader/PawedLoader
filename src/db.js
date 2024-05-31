const IndexedDBsimple = require('./classes/IndexedDBSimple');

// Create a DataBase in IndexedDB and use it
const DB = new IndexedDBsimple();
DB.setDBName('PawedLoader');
module.exports = DB;