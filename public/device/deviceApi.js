var express = require('express');

var bodyParser = require('body-parser');
var app = express();
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(bodyParser.json());
app.use(allowCrossDomain);

app.get('/deviceInfo/:setting', function (req, res) {
  deviceInfo.getInfoAsync(req.params.setting, function(value) {res.send(value);});
});
app.get('/deviceInfo', function (req, res) {
  deviceInfo.getAllInfoAsync(function(value) {res.send(value);});
});

app.put('/deviceInfo', function (req, res){
  console.log(req.body)
  for(key in req.body)
  {
    deviceInfo.setInfo(key, req.body[key])
  }
  res.status(204).send();
});

app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});
