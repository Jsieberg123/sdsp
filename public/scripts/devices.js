var url = "wss://aggautomation.com/sockets/"
var events = {};

for (var i = 0; i < devices.length; i++) {
    var id = devices[i].id;

    events[id] = {};

    events[id]["display"] = function(display) {
        clearInterval(events[id].interval);
        console.log(id);
        $("#" + id).html(display);
    }

    events[id].interval = setInterval(function() { getDisplay(id); });

    connect(i, false);
}

function connect(i, silent) {
    var id = devices[i].id;

    if (!silent) {
        $("#" + id + "-spinner").show();
        $("#" + id + "-retry").hide();
    }

    var socket = new WebSocket(url + "?topic=" + id);
    socket.id = id;
    socket.i = i;

    socket.onopen = function() {
        console.log("open");
        getDisplay(id);
    }

    socket.onmessage = function(event) {
        var message = JSON.parse(event.data);

        if (!("e" in message) || !("p" in message)) {
            return;
        }

        if (message.e in events[this.id]) {
            events[this.id][message.e](message.p);
        }
    }

    socket.onclose = function() {
        console.log("Lossed connection with " + this.id);
        clearTimeout(devices[this.i].timer);
        devices[this.i].timer = setTimeout(function() { connect(i, true); }, 15000);
    }

    events[id].socket = socket;
}

function getDisplay(id) {
    send(this.id, "get", "");
}

function send(device, event, payload) {
    var message = {
        e: event,
        p: payload
    }
    message = JSON.stringify(message);

    events[device].socket.send(message);
}

function on(device, event, callback) {
    events[device][event] = callback;
}