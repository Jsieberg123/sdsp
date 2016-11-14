var fs = require("fs");

exports.getInfo = function(setting)
{
  try
  {
    jsonInfo = fs.readFileSync(configs.deviceFile, {encoding: "utf8"});
  }
  catch(e)
  {
    jsonInfo = "{}";
  }

  if(jsonInfo == "")
  {
    jsonInfo = "{}";
  }

  info = JSON.parse(jsonInfo);

  if(setting in info)
  {
    return info[setting];
  }
  return null;
}

exports.getInfoAsync = function(setting, callback)
{
  fs.readFile(configs.deviceFile, {encoding: "utf8"}, function(err, jsonInfo)
  {
    if(err)
    {
      callback(null);
    }

    if(jsonInfo == "")
    {
      callback(null);
    }

    info = JSON.parse(jsonInfo);
    callback(info[setting]);
  });
}

exports.getAllInfoAsync = function(callback)
{
  fs.readFile(configs.deviceFile, {encoding: "utf8"}, function(err, jsonInfo)
  {
    if(err)
    {
      callback(null);
    }

    if(jsonInfo == "")
    {
      callback(null);
    }

    info = JSON.parse(jsonInfo);
    callback(info);
  });
}

exports.setInfo = function(setting, value)
{
  try
  {
    jsonInfo = fs.readFileSync(configs.deviceFile, {encoding: "utf8"});
  }
  catch(e)
  {
    jsonInfo = "{}";
  }

  if(jsonInfo == "")
  {
    jsonInfo = "{}";
  }

  info = JSON.parse(jsonInfo);
  info[setting] = value;

  fs.writeFileSync(configs.deviceFile, JSON.stringify(info, null, 2));
}

exports.removeInfo = function(setting, value)
{
  try
  {
    jsonInfo = fs.readFileSync(configs.deviceFile, {encoding: "utf8"});
  }
  catch(e)
  {
    jsonInfo = "{}";
  }

  if(jsonInfo == "")
  {
    jsonInfo = "{}";
  }

  info = JSON.parse(jsonInfo);
  info[setting] = value;

  fs.writeFileSync(configs.deviceFile, JSON.stringify(info, null, 2));
}

exports.setInfoAsync = function(setting, value, callback)
{
  fs.readFile(configs.deviceFile, {encoding: "utf8"}, function(err, jsonInfo)
  {
    if(err)
    {
      jsonInfo = "{}"
    }

    if(jsonInfo == "")
    {
      jsonInfo = "{}";
    }

    info = JSON.parse(jsonInfo);
    info[setting] = value;

    fs.writeFile(configs.deviceFile, JSON.stringify(info, null, 2), function(err){
      callback();
    });
  });
}
