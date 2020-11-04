module.exports = (app, urlShorten) => {

   app.get('/', (req, res) => {
      res.json({
         success: true,
         message: 'UrlShorten API Service.'
      })
   });

   app.get('/:short_id', async (req, res) => {
      let { short_id = null } = req.params,
         url = (short_id && await urlShorten.loadUrl(short_id)) || null;

      return !!url ? res.redirect(url) : res.json({
         success: false,
         error: 'Invalid url reuested.'
      });
   });

   app.post('/shorten?', async (req, res) => {
      let { url = null } = req.query,
         newUrl = null;

      if (url) {
         newUrl = await urlShorten.generateUrl(url);
      }

      return res.json(newUrl ? {
         success: true,
         newUrl: newUrl
      } : {
            success: false
         })
   });
}