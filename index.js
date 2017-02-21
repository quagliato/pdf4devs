// pdf4devs
// 2015-11-13, Curitiba - Brazil
// Author: Eduardo Quagliato <eduardo@quagliato.me>

const bodyParser             = require('body-parser');
const express                = require('express');
const fs                     = require('fs');
const markdown               = require('markdown').markdown;
const moment                 = require('moment');
const pdfFromURL             = require('./pdf-from-url.js');

const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({
  extended: true
}));

expressApp.use('/private-eyes', express.static('pdfs'));

/****************************************************************************/
/* HEALTH CHECK */
/****************************************************************************/
expressApp.all('/status', function(req, res){
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/json');
  res.status(200).json({
    status: 'OK',
    description: 'Lock and load!'
  });
});

/***************************************************************************/
/* GET PAGE */
/***************************************************************************/
expressApp.get('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  fs.readFile('README.md', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'ERROR',
        description: 'Couldn\'t process your request.'
      });
    }

    res.status(200).type('text/html').send(markdown.toHTML(data));
  });
});

/**************************************************************************/
/* PDF */
/**************************************************************************/
expressApp.post('/pdf', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  const payload = req.body;

  if (req.headers.hasOwnProperty("content-type")) {
    if (req.headers["content-type"] != "application/json") {
      payload                   = JSON.parse(Object.keys(req.body)[0]);
    }
  }

  pdfFromURL(payload.url, __dirname + '/pdfs', payload.pageSize, undefined, function(err, filePath){
    console.log(
      moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + 
      ' [' + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + '] ' +
      (err ? JSON.stringify(err) : filePath)
    );

    if (err) {
      return res.status(400).json(err);
    }

    res.status(200).type("pdf").sendFile(filePath);
  });
});

/**************************************************************************/
/* PDF */
/**************************************************************************/
expressApp.get('/pdf/:url/:pageSize?', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  if (!req.params.url) return res.status(404).send('No URL informed.');
  const url = req.params.url;
  
  const pageSize = 'A4';
  if (req.params.pageSize) pageSize = req.params.pageSize;

  pdfFromURL(url, __dirname + '/pdfs', pageSize, undefined, function(err, filePath){
    console.log(
      moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + 
      ' [' + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + '] ' +
      (err ? JSON.stringify(err) : filePath)
    );

    if (err) {
      return res.status(500).send('Couldn\' create your PDF.');
    }

    res.status(200).type("pdf").sendFile(filePath);
  });
});

expressApp.listen(3100);
