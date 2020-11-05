const express = require('express');
const bodyParser = require('body-parser');
const Path = require('path');

const CONFIG = require('./conf');
const UrlShorten = require('./lib/UrlShorten');
const routes = require('./rotues');

/** API Main Point */
(async () => {

   let app = express(),
      dbPath = Path.resolve(CONFIG.APP.DATA_DIR, CONFIG.APP.DB_FILE_NAME),
      urlShorten = await UrlShorten.INIT(dbPath);

   /** Apply middlewears */
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   /** Setup API Rotues */
   routes(app, urlShorten);

   /** Error: Not Found (404) */
   app.use((req, res) => {
      res.json({
         success: false,
         error: '404, Invalid reuested.'
      });
   });

   /** Global Error Handler */
   app.use((err, req, res, next) => {
      res.json({
         success: false,
         error: '500, Internal error.'
      });
      console.error('*** Server Error Log  ***', err);
   });

   /** Initiate API Server. */
   app.listen(CONFIG.PORT, async () => {
      console.log(`Url Shorten running on port ${CONFIG.PORT}`);
   });

})();
