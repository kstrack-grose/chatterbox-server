/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// ADDED HERE
var http = require("http");
exports = module.exports = {};

var objectId = 1;
var allMessages = {};
allMessages.results = messages = [];
messages.push({text: "fooooobaraara", username: "kiri", objectId: objectId});


var getData = function(request, callback) {
  var data = '';
  request.on('data', function(datum) {
    data += datum;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
}

module.exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  if (request.method === 'OPTIONS') {
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  } else if (request.method === 'POST' && (request.url === '/classes/chatterbox' || request.url === '/classes/room1' || request.url === '/classes/messages')) {
    var statusCode = 201;
    getData(request, function(message) {
      message.objectId = ++objectId;
      messages.push(message);
    }); 
  } else if (request.method === 'GET' && (request.url === '/classes/chatterbox' || request.url === '/classes/room1' || request.url === '/classes/messages')) {
    var statusCode = 200;
  } else {
    var statusCode = 404;
  }

  //FOR ALL CASES
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(allMessages));
}

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

