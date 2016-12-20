module.exports = function(app, stormpath) {

    // =====================================
    // Main Page ===========================
    // =====================================
    app.get('/', stormpath.loginRequired, (req, res) => {
        getUserDevices(req.user).then(devices => {
                res.render("index.ejs", { user: req.user, devices: devices })
            },
            err => {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.post("/delete", stormpath.loginRequired, (req, res) => {
        var application = req.app.get('stormpathApplication');
        var dGroup = {
            name: req.body.id,
            description: req.body.description
        }
        getGroupByName(dGroup, application).then(deleteGroup, console.log).then(() => {
            res.redirect("/");
        }, () => {
            res.redirect("/");
        });
    });

    app.post("/update", stormpath.loginRequired, (req, res) => {
        var application = req.app.get('stormpathApplication');
        var updateGroup = {
            name: req.body.id,
            description: req.body.description
        }
        getGroupByName(updateGroup, application).then(group => { return saveGroupInfo(group, updateGroup) }, console.log).then(() => {
            res.redirect("/");
        }, err => {
            console.log(err);
            res.redirect("/");
        });
    });

    // =====================================
    // Add a device to the current user ====
    // =====================================
    app.post("/addDevice", stormpath.loginRequired, (req, res) => {
        var application = req.app.get('stormpathApplication');
        var newGroup = {
            name: req.body.id,
            description: req.body.description
        }
        getGroupByName(newGroup, application)
            .then(group => { return saveGroupInfo(group, newGroup); }, () => { return createGroup(newGroup, application) })
            .then(group => { return addUserToGroup(req.user, group); }, err => {
                console.log(err);
                res.send(500);
            })
            .then(() => { res.send(204); }, err => {
                console.log(err);
                res.send(204);
            })
    });

    // =====================================
    // Logout ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', { expires: new Date(0) });
        }
        res.redirect('/login');
    });

    function getGroupByName(group, application) {
        return new Promise((good, bad) => {
            var query = {
                name: group.name
            }
            application.getGroups(query, (err, collection) => {
                if (err || !collection || collection.items.length != 1) {
                    console.log(err);
                    bad(err);
                } else {
                    good(collection.items[0]);
                }
            })
        })
    }

    function saveGroupInfo(group, newGroup) {
        return new Promise((good, bad) => {
            group.description = newGroup.description;
            group.save(err => {
                if (err) {
                    bad(err);
                } else {
                    good(group);
                }
            });
        });
    }

    function createGroup(group, application) {
        return new Promise((good, bad) => {
            application.createGroup(group, (err, group) => {
                if (err) {
                    bad(err);
                } else {
                    good(group);
                }
            });
        });
    }

    function addUserToGroup(user, group) {
        return new Promise((good, bad) => {
            user.addToGroup(group, function(err) {
                if (err) {
                    bad(err);
                } else {
                    good();
                }
            })
        });

    }

    function deleteGroup(group) {
        return new Promise((good, bad) => {
            group.delete(err => {
                if (err) {
                    bad(err);
                } else {
                    good();
                }
            });
        });
    }

    function getUserDevices(user) {
        return new Promise((good, bad) => {
            user.getGroups(function(err, collection) {
                if (err || !collection) {
                    bad(err);
                } else {
                    var devices = [];
                    for (var i = 0; i < collection.items.length; i++) {
                        devices.push({
                            id: collection.items[i].name,
                            description: collection.items[i].description
                        });
                    }
                    good(devices);
                }
            })
        });
    }
}