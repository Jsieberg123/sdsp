module.exports = function(app, stormpath, settings) {

    // =====================================
    // Main Page ===========================
    // =====================================
    app.get('/', stormpath.loginRequired, function(req, res) {
        res.render('index.ejs', {
            user : req.user, // get the user out of session and pass to template
            projectName: settings.projectName
        });
    });

    // =====================================
    // Device Discovery Page ===============
    // =====================================
    app.get('/devices', stormpath.loginRequired, function(req, res) {
        res.render('devices.ejs', {
            user : req.user, // get the user out of session and pass to template
            projectName: settings.projectName
        });
    });
  };
