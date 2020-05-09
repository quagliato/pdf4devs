const bodyParser = require('body-parser')
const express = require('express')
const routes = require('./routes')
const {
  PORT
} = process.env

const expressApp = express()

expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({
  extended: true
}))

expressApp.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

expressApp.use((req, res, next) => {
  if (req.headers.hasOwnProperty('content-type') && req.headers['content-type'] !== 'application/json') {
    const parsedPayload = JSON.parse(Object.keys(req.body)[0]);
    req.body = parsedPayload
  }
  next()
})

routes(expressApp)

expressApp.use((err, req, res, next) => {
  console.error(err)
  return res.status(err.statusCode || 500).json({
    status: 'ERROR',
    code: err.code || 'UNDEFINED',
    description: err.code ? err.message : 'Server Internal Error'
  })
})

expressApp.listen(PORT || 3100)