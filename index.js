// author: eduardo@quagliato.me
//   date: 2015-11-13 (friday, muahaha!)

require('newrelic');

bodyParser               = require("./node_modules/body-parser/index.js");
express                  = require("./node_modules/express/index.js");
moment                   = require("./node_modules/moment/moment.js");
pdfFromURL               = require("./pdf-from-url.js");
sha1                     = require("./node_modules/sha1/sha1.js");
util                     = require("util");

var expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({
  extended: true
}));

expressApp.post('/:functionName', function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var functionName           = request.params.functionName;
  var data                   = request.body;

  if (request.headers.hasOwnProperty("content-type")) {
    if (request.headers["content-type"] != "application/json") {
      data                   = JSON.parse(Object.keys(request.body)[0]);
    }
  }

  console.log("***************************************************************");
  console.log(moment().format());
  console.log("  function: " + functionName);
  console.log("parameters:");
  console.log(data);

  switch (functionName) {
    case "status":
      response.status(200).end(JSON.stringify({"status":"OK"}));
      break
    case "pdf":
      pdfFromURL(data.url, "/home/quagliato/www/pdf4devs/pdfs", data.pageSize, undefined, function(err, filePath){
        console.log("finished");
        if (err) {
          response.status(400).end(JSON.stringify(err));
        } else {
          console.log("pdf path: " + filePath);
          response.status(200).type("pdf").sendFile(filePath);
        }
      });
      break;
    default:
      response.status(404).end("unidentified request");
  }
});

expressApp.listen(3100);

