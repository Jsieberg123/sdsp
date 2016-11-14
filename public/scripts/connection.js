var socket = new WebSocket(getUri());
var connected = false;

socket.onopen = function(){
  connected = true;
  console.log("connected");
  for(var i=0;i<Router.onConnectHandlers.length;i++)
  {
    Router.onConnectHandlers[i]();
  }
};

socket.onerror = function(error){
  console.log("Err", error);
};

socket.onmessage = function(msg)
{
  msg = JSON.parse(msg.data);
  console.log("Recieved ",msg);
  if(typeof(msg.from) != 'string')
  {
    console.log("Invalid Message");
  }
  else{
    for(var i=0;i<Router.handlers[msg.from].length;i++)
    {
      Router.handlers[msg.from][i](msg);
    }
  }
}

var Router = {
  AddHandler:addHandler,
  handlers:{},
  AddOnConnectHandler:addOnConnectHandler,
  onConnectHandlers:[],
  SendMessage:sendMessage
}

function sendMessage(msg)
{
  console.log("Sending ", msg)
  socket.send(JSON.stringify(msg));
}

function addOnConnectHandler(handler)
{
  if(connected)
  {
    handler();
    return;
  }
  Router.onConnectHandlers.push(handler);
}

function addHandler(id, handler)
{
  if(typeof(Router.handlers[id]) != 'undefinded')
  {
    Router.handlers[id] = [];
  }
  Router.handlers[id].push(handler);
}

function getUri(){
  var loc = window.location, new_uri;
  if(loc.protocol === "https")  {
    new_uri = "wss:";
  }
  else {
    new_uri = "ws:";
  }
  new_uri += "//"+ loc.host;
  new_uri += loc.pathname + "sockets/user";
  return new_uri;
}
