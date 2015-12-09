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

/****************************************************************************/
/* HEALTH CHECK */
/****************************************************************************/
expressApp.get('/status', function(request, response){
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Content-Type', 'text/json');
  response.status(200).end(JSON.stringify({"status":"OK"}));
});

expressApp.post('/status', function(request, response){
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Content-Type', 'text/json');
  response.status(200).end(JSON.stringify({"status":"OK"}));
});

/***************************************************************************/
/* GET PAGE */
/***************************************************************************/

expressApp.get('/', function(request, response, body) {
  response.set('Access-Control-Allow-Origin', '*');

  var fs = require('fs');
  fs.readFile('README.html', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      response.set('Content-Type', 'text/json');
      response.status(500).end(JSON.stringify({"status":"ERROR","description":"Couldn't process your request."}));
    } else {
      response.set('Content-Type', 'text/html');
      response.end(data);
    }
  });
});

/**************************************************************************/
/* PDF */
/**************************************************************************/

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
  
  switch (functionName) {
    case "pdf":
      pdfFromURL(data.url, "/www/quagliato-pdf4devs/pdfs", data.pageSize, undefined, function(err, filePath){
        if (err) {
          response.set('Access-Control-Allow-Origin', '*');
          response.set('Content-Type', 'text/json');
          response.status(400).end(JSON.stringify(err));
        } else {
          response.status(200).type("pdf").sendFile(filePath);
        }
      });
      break;
    default:
      response.set('Access-Control-Allow-Origin', '*');
      response.set('Content-Type', 'text/json');
      response.status(404).end(JSON.stringify({"status":"ERROR", "description":"Unknown request."}));
  }
});

expressApp.listen(3100);
