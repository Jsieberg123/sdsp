
var ipBase = "192.168.0."
var waitTime = 5000;
var waitingPings = 0
var startAddress = 100;
var endAddress = 200;
var deviceFound = false;

function ScanForDevices(startAddress, endAddress)
{
  deviceFound = false;
  $("#status").html("Scanning for devices");
  $("#deviceDisplay").addClass("loader");
  $("#deviceDisplay").html("");
  for(var i=startAddress;i<=endAddress;i++)
  {
    waitingPings++;
    PingDevice(ipBase + i);
  }
  window.setTimeout(NoDevicesFound, waitTime * (endAddress - startAddress));
}

function NoDevicesFound()
{
  if(deviceFound)
  {
    return;
  }
  $("#status").html("No Devices Found")
  $("#deviceDisplay").removeClass("loader")
}

function HandleNewDevice(deviceData, addr)
{
  deviceData['addr'] = addr;
  deviceFound = true;
  waitingPings--;
  $("#status").html("Discovered Devices")
  $("#deviceDisplay").removeClass("loader")
  var html = new EJS({url: '/templates/device.ejs'}).render(deviceData)
  $("#deviceDisplay").append(html);
}

function PingDevice(address)
{
  var uri = "http://" + address + "/deviceInfo";
  $.ajax({
  url: uri,
  method:"GET",
  crossDomain: true,
  dataType:'json',
  success: function (data) {HandleNewDevice(data, address);},
  error:OnPingFail,
  timeout: waitTime
});
}

function saveToDevice(id, addr)
{
  var data = {};

  var name = $("#"+id).find(".name").val();
  data['name'] = name;

  $.ajax({
    method:"PUT",
    url:"http://"+addr +"/deviceInfo",
    crossDomain:true,
    dataType:'json',
    complete:function (){
      reloadDevice(id, addr);
    },
    contentType:"application/json",
    data : JSON.stringify(data),
  });
}

function addDevice(id, addr)
{
  data = {id:id}
  $.ajax({
    method:"POST",
    cache:false,
    url:"/api/device/new",
    crossDomain:true,
    dataType:'json',
    contentType:'application/json',
    success:function (){console.log("Device Added"); devices.push(id);},
    error:function (){console.log("Device add failed")},
    complete:function () {reloadDevice(id, addr)},
    data:JSON.stringify(data)
  });
}

function removeDevice(id, addr)
{
  data = {id:id}
  $.ajax({
    method:"POST",
    cache:false,
    url:"/api/device/remove",
    crossDomain:true,
    dataType:'json',
    contentType:'application/json',
    success:function (){console.log("Device removed"); devices.pop(id);},
    error:function (){console.log("Device remove failed")},
    complete:function () {reloadDevice(id, addr)},
    data:JSON.stringify(data)
  });
}

function reloadDevice(id, addr)
{
  $("#" + id).remove();
  PingDevice(addr);
}

function OnPingFail(){
  waitingPings--;
  if(waitingPings == 0)
  {
    NoDevicesFound();
  }
}

ScanForDevices(startAddress, endAddress);
