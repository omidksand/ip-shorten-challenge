const ShortId = require('shortid');
const DB = require('./db');

module.exports = class UrlShorten {

   static async INIT(dbName) {
      let tmp = new UrlShorten();
      await tmp.init(dbName);
      return tmp;
   }

   /**
    * Initiate UrlShorten Class database.
    * @param {String} dbName 
    * @returns {UrlShorten}
    */
   async init(dbName) {
      this.db = await DB.open(dbName)

      if (this.db) {
         await this._ensureTableExist()
      }

      return this;
   }

   /**
    * Close database active connection
    * @returns {void}
    */
   close() {
      if (this.db) this.db.close();
   }

   /**
    * Ensure required table exist in database.
    */
   async _ensureTableExist() {
      await this.db.run(
         `CREATE TABLE IF NOT EXISTS urls (
            id CHAR(10) PRIMARY KEY,
            url TEXT NOT NULL,
            dateCreated NOT NULL DEFAULT CURRENT_TIMESTAMP
         )`
      );
   }

   /**
    * Generates a new hashed Id from a given url.
    * @param {String} url 
    * @returns {Promise<String>}
    */
   async generateUrl(url) {
      let db = this.db,
         newID = ShortId.generate();

      await db.run(
         'INSERT INTO urls(id, url) VALUES(?,?)',
         [newID, url]
      );

      return newID;
   }

   /**
    * Gets the original URl stored in database from hashedUrl.
    * @param {String} urlId 
    * @returns {Promise<String|null>}
    */
   async loadUrl(urlId) {
      let db = this.db.db;

      return new Promise((resolve, reject) => {
         db.all(`SELECT url FROM urls WHERE id = ? LIMIT 1`, [urlId], (err, rows) => {
            return err ? reject(err) : resolve((rows && rows.length > 0) ? rows[0].url : null)
         })
      })
   }
}

