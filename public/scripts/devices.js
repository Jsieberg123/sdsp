var url = "wss://aggautomation.com/sockets"

for (var i = 0; i < devices.length; i++) {
    connect(i, false);
}

function connect(i, silent) {
    var id = devices[i].id;

    if (!silent) {
        $("#" + id + "-spinner").show();
        $("#" + id + "-retry").hide();
    }

    var timer = setTimeout(function(id, i) {
        $("#" + id + "-spinner").hide();
        $("#" + id + "-retry").show();
        setTimeout(function() { connect(i, true); }, 15000);
    }.bind(null, id, i), 5000);
    var displayInfo = new WebSocket(url + "?topic=display-" + id);
    displayInfo.i = i;

    displayInfo.onopen = function() {
        this.send("Get");
    }

    displayInfo.onmessage = function(event) {
        if (event.data === "Get") {
            return;
        }

        devices[this.i].template = ejs.compile(event.data, {});
        this.close();
    }

    var displayData = new WebSocket(url + "?topic=data-" + id);
    displayData.i = i;

    displayData.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if ("cmd" in data) {
            return;
        }
        data.i = displayData.i;
        data.id = devices[this.i].id
        if ("template" in devices[this.i]) {
            var html = devices[this.i].template(data);
            $("#" + devices[this.i].id).html(html);
        }
    };

    displayData.onclose = function() {
        connect(this.i, true);
    }

    devices[i].ws = displayData;
}

function send(i, cmd, payload) {
    var message = JSON.stringify({
        cmd: cmd,
        payload: payload
    });

    devices[i].ws.send(message);
}