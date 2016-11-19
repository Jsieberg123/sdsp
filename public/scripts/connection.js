function ConnectToTopic(topic, messageHandler, onConnect)
{
  var socket = new WebSocket(getUri()+"?topic="+topic +"-web");
  socket.onopen = function()
  {
    onConnect({
      send: function(msg){
        socket.send(JSON.stringify({topic:topic+"-device", payload:msg}));
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

ConnectToTopic("F30Qj8AfZQIhsk9dDGCPGN8JXLENjiN0", onMessage, function(connection){connection.send({action:"Get-Cards"})})

function getUri(){
  var loc = window.location, new_uri;
  new_uri = "wss:";
  new_uri += "//"+ loc.host + "/sockets";
  //new_uri = "ws://127.0.0.1:5693";
  return new_uri;
}
