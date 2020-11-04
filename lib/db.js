const Sqlite3 = require('sqlite3').verbose();

module.exports = class DB {

   static get OPEN_READONLY() { return Sqlite3.OPEN_READONLY }
   static get OPEN_READWRITE() { return Sqlite3.OPEN_READWRITE }
   static get OPEN_CREATE() { return Sqlite3.OPEN_CREATE }

   static open(filename, mode) {
      let db = new DB()
      return db.open(filename, mode)
   }

   constructor() {
      this._db = null;
      this._filename = null;
   }

   /**
    * @description
    * Open and connect to database.
    * @param {String} filename 
    * @param {Number} mode 
    */
   open(filename, mode) {
      if (typeof mode === 'undefined') {
         mode = DB.OPEN_READWRITE | DB.OPEN_CREATE
      } else if (typeof mode !== 'number') {
         throw new TypeError('DB.open: mode is not a number')
      }
      return new Promise((resolve, reject) => {
         if (this._db) return reject(new Error('DB.open: database is already open'))

         let db = new Sqlite3.Database(filename, mode, err => {
            if (err) reject(err)

            this._db = db
            this._filename = filename
            resolve(this)
         })
      })
   }

   /**
    * Close connection
    */
   close() {
      if (this._db) {
         this._db.close();
      }
   }

   /**
    * Promisify sqlite internal methods.
    * @param {Function} call 
    * @param  {...any} args 
    * @protected
    * @returns {Promise<>}
    */
   _promisify(call, ...args) {
      let db = this._db;

      return new Promise((resolve, reject) => {
         let cb = function (err) {
            return err ? reject(err) : resolve(this)
         }
         args.push(cb);
         db[call].apply(db, args);
      })
   }

   get db() {
      return this._db;
   }

   run(sql, params) {
      return this._promisify('run', sql, params);
   }

   get(sql, params) {
      return this._promisify('get', sql, params);
   }
}
