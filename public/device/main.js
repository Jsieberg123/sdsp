var http = require('http');
var fs = require('fs');
var address = "192.168.0.50";

var filesToLoad =
[
  "configs",
  "deviceInfo",
  "deviceApi",
  "startup",
  "communication"
]
numOfFiles = filesToLoad.length;

for(var i=0;i<filesToLoad.length;i++)
{
  loadFromWeb(filesToLoad[i]);
}

function loadFromWeb(name, callback)
{
  var file = fs.createWriteStream("/home/pi/" + name + ".js");
  var request = http.get("http://" + address + "/device/" + name + ".js", function(response) {
    var stream =response.pipe(file);
    stream.on("finish", function ()
        {
          GLOBAL[name] = require("/home/pi/"+ name);
          numOfFiles--;
          if(numOfFiles == 0)
          {
            Run();
          }
        });
  });
}

function Run()
{
  configs.address = address;
  startup.start();
}
