var url = "wss://aggautomation/sockets/"
var events = {};

for (var i = 0; i < devices.length; i++) {
    connect(i, false);
}

function connect(i, silent) {
    var id = devices[i].id;

    if (!silent) {
        events[id] = {};
        $("#" + id + "-spinner").show();
        $("#" + id + "-retry").hide();
    }

    devices[i].timer = setTimeout(function(id, i) {
        $("#" + id + "-spinner").hide();
        $("#" + id + "-retry").show();
        clearTimeout(devices[i].timer);
        devices[i].timer = setTimeout(function() { connect(i, true); }, 15000);
    }.bind(null, id, i), 5000);

    var socket = new WebSocket(url + "?topic=" + id);
    socket.id = id;
    socket.i = i;

    socket.onopen = function() {
        console.log("open");
        send(this.id, "get", "");
    }

    socket.onmessage = function(event) {
        console.log(event);
        var message = JSON.parse(event.data);

        if (!("e" in message) || !("p" in message)) {
            return;
        }

        clearTimeout(devices[this.i].timer);
        console.log(message.e);

        if (message.e in events[this.id]) {
            console.log("here");
            events[this.id][message.e](message.p);
        }
    }

    socket.onclose = function() {
        console.log("Lossed connection with " + this.id);
        clearTimeout(devices[this.i].timer);
        devices[this.i].timer = setTimeout(function() { connect(i, true); }, 15000);
    }

    events[id]["display"] = function(display) {
        console.log(id);
        $("#" + id).html(display);
    }

    events[id].socket = socket;
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