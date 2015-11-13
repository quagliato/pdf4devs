// author: eduardo@quagliato.me
//   date: 2015-11-13 (friday, muahaha!)

bodyParser               = require("./node_modules/body-parser/index.js");
express                  = require("./node_modules/express/index.js");
moment                   = require("./node_modules/moment/moment.js");
util                     = require("util");


var expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({
  extended: true
}));

expressApp.get('/:functionName', function(request,response){
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var functionName           = request.params.functionName;
  var data                   = request.body;

  console.log(functionName);

  switch (functionName) {
    case "status":
      response.status(200).end("status request");
      break
    case "pdf":
      response.status(200).end("pdf request");
      break;
    default:
      response.status(404).end("unidentified request");
  }
});

expressApp.listen(3004);

