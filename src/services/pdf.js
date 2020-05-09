const fs = require('fs');
const moment = require('moment');
const path = require('path')
const sha1 = require('sha1');
const validUrl = require('valid-url');
const wkhtmltopdf = require('wkhtmltopdf');

const InvalidUrlException = require('../exceptions/InvalidUrlException')
const InvalidPageSizeException = require('../exceptions/InvalidPageSizeException');

const acceptablePageSizes  = ["letter", "A2", "A3", "A4", "A5"];

const fromURL = async (url, pageSize) => {
  if (url === undefined || url === null || !validUrl.isUri(url)) {
    throw new InvalidUrlException()
  }

  if (acceptablePageSizes.indexOf(pageSize) === -1) {
    throw new InvalidPageSizeException()
  }

  const filename = sha1(url + moment().format('YYYY-MM-DD-hh')) + '.pdf';
  const file = `${path.dirname(require.main.filename)}/pdfs/${filename}`

  if (fs.existsSync(file)) return file

  const options = {
    pageSize: pageSize,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    output: file
  }
  
  await callWkhtmlToPdf(url, options)

  if (fs.existsSync(file)) return file

  throw new Error('Could not create your PDF file.')
}

const callWkhtmlToPdf = (url, options) => {
  return new Promise((resolve) => {
    wkhtmltopdf(url, options, (code, signal) => {
      console.log('wkthtmltopdf result', url, options.output, code, signal)
      return resolve()
    })
  })
}

module.exports = {
 fromURL
}
