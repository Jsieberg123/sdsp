exports.start = function()
{
  if(deviceInfo.getInfo("id") == null)
  {
    deviceInfo.setInfo("id", makeid());
  }

  communication.start();
  communication.sendMessage("Hello World");
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
