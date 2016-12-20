const express = require('express');
const stormpath = require('express-stormpath');
const bodyParser = require('body-parser');
require('./sockets/sockets.js')

var app = express();

app.use(stormpath.init(app, {
    apiKey: {
        id: '3IDAQNXL0MHXHFUVIF4A7BRVJ',
        secret: 'Rp3Fg6IxKNbQMX9NOcTi//Uj/8eXiyr5JLUm7e3sST4'
    },
    application: {
        href: `https://api.stormpath.com/v1/applications/7jZHNY3HuK5KIzzTBFZBTn`
    },
    expand: {
        customData: true,
    },
    web: {
        login: {
            view: "pages/login.ejs"
        },
        register: {
            view: "pages/register.ejs"
        },
        forgotPassword: {
            view: "pages/forgot.ejs",
            nextUri: "/login?status=forgot"
        },
        verify: {
            nextUri: "/login?status=verify"
        },
        changePassword: {
            view: "pages/passwordReset.ejs",
            nextUri: "/login?status=reset"
        }
    }
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static('public'));
require('./routes.js')(app, stormpath); // load our routes and pass in our app and fully configured passport

app.listen(5692);

// Stormpath will let you know when it's ready to start authenticating users.
app.on('stormpath.ready', function() {
    console.log('Stormpath Ready!');
});