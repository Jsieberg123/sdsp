module.exports = function(app, stormpath, settings) {

  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


var addDevicesIfNotPresent = function(req)
{
  if(!("devices" in req.user.customData))
  {
    req.user.customData.devices = [];
    req.user.customData.save(function(err){
      console.log(err);
    });
  }
}

app.use(allowCrossDomain);

    // =====================================
    // Main Page ===========================
    // =====================================
    app.get('/', stormpath.loginRequired, function(req, res) {
      addDevicesIfNotPresent(req);
        res.render('index.ejs', {
            user : req.user, // get the user out of session and pass to template
            projectName: settings.projectName
        });
    });

    // =====================================
    // Device Discovery Page ===============
    // =====================================
    app.get('/devices', stormpath.loginRequired, function(req, res) {
      addDevicesIfNotPresent(req);
        res.render('devices.ejs', {
            user : req.user, // get the user out of session and pass to template
            projectName: settings.projectName
        });
    });
  };
