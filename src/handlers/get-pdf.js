
const moment = require('moment')
const pdf = require('../services/pdf');
const InvalidUrlException = require('../exceptions/InvalidUrlException');

module.exports = async (req, res, next) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss.SSS Z')
  const originAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  if (!req.params.url) return next(new InvalidUrlException())
  const url = req.params.url;
  
  let pageSize = 'A4';
  if (req.params.pageSize) pageSize = req.params.pageSize;

  try {
    const filePath = await pdf.fromURL(url, pageSize)
    console.log(`${now} [${originAddress}] ${url} ${filePath}`)
    return res.status(200).type('pdf').sendFile(filePath)
  } catch (err) {
    console.log(`${now} [${originAddress}] ${url} ${err.message}`)
    return next(err)
  }
}