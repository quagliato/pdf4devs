// author: eduardo@quagliato.me
//   date: 2015-11-13 (friday, muahaha!)

const fs                     = require('fs');
const moment                 = require('moment');
const sha1                   = require('sha1');
const util                   = require('util');
const validUrl               = require('valid-url');
const wkhtmltopdf            = require('wkhtmltopdf');

module.exports = function(url, storePath, pageSize, margins, callback){

  const path                   = storePath;
  var acceptablePageSizes    = ["letter", "A2", "A3", "A4", "A5"];

  if (url === undefined || url === null || !validUrl.isUri(url)) return callback({
    status: 'ERROR',
    code: '0001',
    description: 'URL is not valid.'
  });

  if (acceptablePageSizes.indexOf(pageSize) === -1) return callback({
    status: 'ERROR',
    code: '0002',
    description: 'Page size not accepted.'
  });
    
  const filename = sha1(url + moment().format('YYYY-MM-DD-hh')) + '.pdf';
  var fileFullPath = path + '/' + filename;

  fs.readFile(fileFullPath, function(err, data){
    if (!err) return callback(undefined, fileFullPath);

    var options = {
      pageSize: pageSize,
      marginTop: margins !== undefined && margins.top > 0 ? margins.top : 0,
      marginRight: margins !== undefined && margins.right > 0 ? margins.right : 0,
      marginBottom: margins !== undefined && margins.bottom > 0 ? margins.bottom : 0,
      marginLeft: margins !== undefined && margins.left > 0 ? margins.left : 0,
      output: fileFullPath
    };

    wkhtmltopdf(url, options, function(code, signal){
      console.log(code, signal);

      fs.readFile(fileFullPath, function(err, data){
        if (err) return callback({
          status: 'ERROR',
          code: '0003',
          description: 'Could not create a PDF from the url ' + url
        })

        callback(undefined, fileFullPath);
      });
    });
  });
};
