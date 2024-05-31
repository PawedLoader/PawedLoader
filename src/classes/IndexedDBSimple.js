// https://web.archive.org/web/20240503173045/https://raw.githubusercontent.com/Mistium/extensions.mistium/main/featured/IndexedDB.js
// License was not provided in that version,
// Intern im making it MIT for this project.
// (I did not make this Alex, And I dont understand IndexedDB so uh I cant comment it)
module.exports = class IndexedDBsimple {
  constructor() {
    this.dbName = 'PawedLoader';
    this.dbVersion = 1;
    this.db;
  }

  setDBName(NAME) {
    this.dbName = NAME;
    this.initializeDatabase();
  }

  initializeDatabase() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = function(event) {
      console.error('IndexedDB error:', event.target.error);
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
    };

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      const objectStore = this.db.createObjectStore('data', {
        keyPath: 'key'
      });
    };
  }

  writeToDatabase(KEY, VALUE) {
    const transaction = this.db.transaction(['data'], 'readwrite');
    const objectStore = transaction.objectStore('data');
    objectStore.put({
      key: KEY,
      value: VALUE
    });
  }

  async readFromDatabase(KEY) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['data'], 'readonly');
      const objectStore = transaction.objectStore('data');
      const request = objectStore.get(KEY);
      request.onsuccess = function(event) {
        resolve(event.target.result ? event.target.result.value : null);
      };
      request.onerror = function(event) {
        reject('Error reading from database');
      };
    });
  }

  async getAllKeys() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['data'], 'readonly');
      const objectStore = transaction.objectStore('data');
      const request = objectStore.getAllKeys();
      request.onsuccess = function(event) {
        const keysArray = event.target.result;
        const keysJSON = JSON.stringify(keysArray);
        resolve(keysJSON);
      };
      request.onerror = function(event) {
        reject('Error getting keys from database');
      };
    });
  }


  async keyExists(KEY) {
    const keys = await this.getAllKeys();
    return keys.includes(KEY);
  }

  deleteFromDatabase(KEY) {
    const transaction = this.db.transaction(['data'], 'readwrite');
    const objectStore = transaction.objectStore('data');
    objectStore.delete(KEY);
  }
}