exports.start = function()
{
  open = false;
  var WebSocket = require('ws');
  ws = new WebSocket('ws://'+configs.address+"/"+deviceInfo.getInfo("id"));
  ws.onopen = function()
  {
    console.log("open");
     open = true;
     for(var i=0;i<messages.length;i++)
     {
       exports.sendMessage(messages[i]);
     }
  }
}

var messages = []

exports.sendMessage = function(message){
  if(open)
  {
    ws.send(message);
  }
  else{
    messages.push(message);
  }
}
