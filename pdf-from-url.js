// author: eduardo@quagliato.me
//   date: 2015-11-13 (friday, muahaha!)

module.exports = function(url, storePath, pageSize, margins, callback){

  var path                   = storePath === undefined || storePath.length == 0 ? "./" : storePath;
  var acceptablePageSizes    = ["letter", "A2", "A3", "A4", "A5"];

  if (acceptablePageSizes.indexOf(pageSize) === -1) {
    callback({"code":"001", "description":"Page size not accepted."});
  } else {
    var fs                   = require("fs");
    var wkhtmltopdf          = require("./node_modules/wkhtmltopdf/index.js");
    var filename             = sha1(url + moment().format("YYYY-MM-DD-hh-mm")) + ".pdf";

    var fileFullPath         = path + "/" + filename;

    var options              = {
      pageSize: pageSize,
      marginTop: margins !== undefined && margins.top > 0 ? margins.top : 0,
      marginRight: margins !== undefined && margins.right > 0 ? margins.right : 0,
      marginBottom: margins !== undefined && margins.bottom > 0 ? margins.bottom : 0,
      marginLeft: margins !== undefined && margins.left > 0 ? margins.left : 0,
      output: fileFullPath
    };

    try {
      if (fs.lstatSync(fileFullPath)) {
        callback(undefined, fileFullPath);
      }
    } catch (exception) {
      wkhtmltopdf(url, options, function(code, signal){
        if (fs.lstatSync(fileFullPath)) {
          callback(undefined, fileFullPath);
        } else {
          callback({"code":"002", "description":"Couldn't create PDF file."});
        }
      });
    }
  }
};