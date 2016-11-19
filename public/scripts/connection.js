function ConnectToTopic(topic, messageHandler, onConnect)
{
  var socket = new WebSocket(getUri()+"?topic="+topic +"-web");
  var connection = {
      Send: function(msg){
        socket.send(JSON.stringify({topic:topic+"-device", payload:msg}));
      },
      topic:topic,
      socket:socket
    };
  socket.onopen = function()
  {
    onConnect(connection);
  }

  socket.onmessage = function (event){
    messageHandler(JSON.parse(event.data), connection);
  };
}

function getUri(){
  var loc = window.location, new_uri;
  //new_uri = "wss:";
  //new_uri += "//"+ loc.host + "/sockets";
  new_uri = "ws://127.0.0.1:5693";
  return new_uri;
}
