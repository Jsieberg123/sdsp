function ConnectToTopic(topic, messageHandler, onConnect)
{
  var socket = new WebSocket(getUri());
  socket.onopen = function()
  {
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

ConnectToTopic("test", onMessage, function(connection){connection.send({type:"test", payload:"this string"})})

function getUri(){
  var loc = window.location, new_uri;
  //new_uri = "wss:";
  //new_uri += "//"+ loc.host + "/sockets";
  new_uri = "ws://127.0.0.1:5693/?topic=test";
  return new_uri;
}
