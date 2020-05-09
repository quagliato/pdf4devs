const index = require('./handlers/index')
const status = require('./handlers/status')
const postPdf = require('./handlers/post-pdf')
const getPdf = require('./handlers/get-pdf')

module.exports = (app) => {
  app.all('/', index)
  app.all('/status', status)
  app.post('/pdf', postPdf)
  app.get('/pdf/:url/:pageSize?', getPdf)
}