var url = "wss://aggautomation.com/sockets/"
var events = {};

for (var i = 0; i < devices.length; i++) {
    var id = devices[i].id;

    events[id] = {};

    events[id]["display"] = function(display, id) {
        clearInterval(events[id].interval);
        $("#" + id).html(display);
    }

    //events[id].interval = setInterval(function() { getDisplay(id); }, 15000);

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
        console.log(this);
        getDisplay(this.id);
    }

    socket.onmessage = function(event) {
        console.log(event);
        var message = JSON.parse(event.data);

        if (!("e" in message) || !("p" in message)) {
            return;
        }

        if (message.e in events[this.id]) {
            events[this.id][message.e](message.p, this.id);
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
    send(id, "get", "");
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