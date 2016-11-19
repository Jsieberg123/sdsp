var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 5693 });

var router = {};
var id = 0;
wss.on('connection', function connection(ws) {
  var url = ws.upgradeReq.url;
  var params = GetParams(url);
  var topic = params.topic;
  id++;

  ws.on('message', function(message) {
    Send(JSON.parse(message));
  });

  ws.on("close", function(){
    console.log("disconnected");
    delete router[topic][id];
    if(Object.keys(router[topic]).length == 0)
    {
      delete router[topic];
    }
  });

  if(!(topic in router))
  {
    router[topic] = {};
  }
  router[topic][id] = ws;
});

function Send(message)
{
  if(message.topic in router)
  {
    var stringMessage = JSON.stringify(message.payload);
    for(key in router[message.topic])
    {
      router[message.topic][key].send(stringMessage);
    }  
  }
}

function GetParams(uri)
{
  var index = uri.indexOf("?")+1;
  var query = uri.substr(index);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
