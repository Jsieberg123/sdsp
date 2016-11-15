function ConnectToTopic(topic, messageHandler, onConnect)
{
  var socket = new WebSocket(getUri());
  socket.onopen = function()
  {
    socket.send(topic);
    onConnect({
      send: function(msg){
        socket.send(JSON.stringify({topic:topic, payload:msg}));
      },
      topic:topic,
      socket:socket
    });
  }

  socket.onmessage = function (event){
    messageHandler(event.data);
  };
}

function onMessage(message)
{
  console.log(message);
}

ConnectToTopic("test", onMessage, function(connection){connection.send("Hello World")})

function getUri(){
  var loc = window.location, new_uri;
  if(loc.protocol === "https")  {
    new_uri = "wss:";
  }
  else {
    new_uri = "ws:";
  }
  new_uri += "//"+ loc.host.slice + "/sockets";
  return new_uri;
}
