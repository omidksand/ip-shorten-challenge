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

   /** Initiate API Server. */
   app.listen(CONFIG.PORT, async () => {
      console.log(`Url Shorten running on port ${CONFIG.PORT}`);
   });

})();
