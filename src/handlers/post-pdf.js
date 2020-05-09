const moment = require('moment')
const pdf = require('../services/pdf')

module.exports = async (req, res, next) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss.SSS Z')
  const originAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const payload = req.body
  try {
    const filePath = await pdf.fromURL(payload.url, payload.pageSize)
    console.log(`${now} [${originAddress}] ${payload.url} ${filePath}`)
    return res.status(200).type('pdf').sendFile(filePath)
  } catch (err) {
    console.log(`${now} [${originAddress}] ${payload.url} ${err.message}`)
    return next(err)
  }
}