var url = "wss://aggautomation.com/sockets"

for (var i = 0; i < devices.length; i++) {
    var id = devices[i].id;

    connect(i);

    var displayData = new WebSocket(url + "?topic=data-" + id);
    displayData.i = i;

    displayData.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if ("template" in devices[this.i]) {
            var html = devices[this.i].template(data);
            $("#" + devices[this.i].id).html(html);
        }
    };
}

function connect(i) {
    var id = devices[i].id;

    $("#" + id + "-spinner").show();
    $("#" + id + "-retry").hide();

    var timer = setTimeout(function(id, i) {
        $("#" + id + "-spinner").hide();
        $("#" + id + "-retry").show();
        setTimeout(function() { connect(i); }, 15000);
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
}