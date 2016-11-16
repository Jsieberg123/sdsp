var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 5693 });

var router = {};

wss.on('connection', function connection(ws) {
  ws.onMessage = function (message){onNewSocketMessage(message,ws);};
  ws.on('message', function incoming(message) {
    ws.onMessage(message);
  });
});

function onNewSocketMessage(message, ws)
{
  if(!(message in router))
  {
    console.log(message + " added to router topics");
    router[message] = [];
  }

  router[message].push(ws);
  ws.onMessage = onMessage;
}

function onMessage(message)
{
  console.log("new message");
  message = JSON.parse(message);
  console.log(message);
  if(message.topic in router)
  {
    var clients = router[message.topic];
    console.log(clients);
    var removeClients = [];
    for(var i=0;i<clients.length;i++)
    {
      if(clients[i] != null)
      {
        console.log("sending message " + message.payload)
        clients[i].send(message.payload, function ack(error) {
          console.log(error);
            clients[i] = null;
          });
      }
    }
  }
}
