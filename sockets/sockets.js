var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 5693 });

handlers = {};

wss.on('connection', ws => {
    var url = ws.upgradeReq.url;
    var params = getParams(url);
    var topic = params.topic;
    var id = makeId();

    handlers[id] = (message) => {
        try {
            ws.send(message);
            wss.once(topic, handlers[id]);
        } catch (err) {
            if (id in handlers) {
                delete handlers[id];
            }
        }
    }

    ws.on("message", message => {
        wss.emit(topic, message);
    });

    wss.once(topic, handlers[id]);
});

var idNum = 0;

function makeId() {
    if (idNum >= Number.MAX_SAFE_INTEGER) {
        idNum = 0;
    }
    return idNum++;
}

function getParams(uri) {
    var index = uri.indexOf("?") + 1;
    var query = uri.substr(index);
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}