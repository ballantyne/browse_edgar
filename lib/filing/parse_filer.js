const klass       = require('klass');
const _           = require('underscore');
var cheerio       = require('cheerio');

var findIndexes = function(lines, match) {
  return lines.reduce(function(a, e, i) {
    if (e === match)
      a.push(i);
    return a;
  }, []);
}

var splitCompanyRecords = function(lines) {
  var companies = [];
  var indexes = findIndexes(lines, 'Mailing Address')
  indexes.push(lines.length);
  var current;
  var previous;
  for (t=0;t< indexes.length;t++) {
    var index = indexes[t];
    if (previous != undefined) {
      var company = lines.slice(previous, index);
      companies.push(parseFilerArray(company));
    }
    previous = index;
  }
  return companies.reduce(function(acc, x) {
        for (var key in x) acc[key] = x[key];
            return acc;
  }, {});
}

var parseFilerArray = function(lines) {
  var currentKey;
  var keyMap = {'Mailing Address': 'mailing_address', 'Business Address': 'business_address'};
  var lastLine = lines.pop();
  var data = _.object(_.map(lastLine.split('|'), function(kv) { 
    return _.map(kv.split(':'), function(side) { 
      return side.trim().replace('.', '').toLowerCase().split(' ').join('_') 
    }) 
  }));
  var cikLine = lines.pop();
  data.cik = cikLine.match(/CIK\: (\d+) /)[1];
  var activeParty = lines.pop();
  var m = activeParty.match(/(.+) \((.+)\)/)
  var role = m[2].toLowerCase().split(' ').join('_');
  data[role] = m[1];
 
  for (r=0;r<lines.length;r++) {
    var line = lines[r];
    if (keyMap[line] != undefined) {
      data[keyMap[line]] = [];
      currentKey = line;
    } else {
      data[keyMap[currentKey]].push(line);
    }
  }

  data.mailing_address = parseAddressArray(data.mailing_address);
  if (data.business_address.length > 0) {
    data.business_address = parseAddressArray(data.business_address);
  } else {
    delete data.business_address;
  }

  var filer = {};
  filer[role] = data;
  return filer;
}

var parseCityStateZip = function(line) {
  // console.log(line)
  var data;
  data = line.match(/(.+)\W(\w\w)\W(\d+)$/)
  if (data == undefined) {
    // japanese city, province zip (TOKYO M0 108-0075)
    data = line.match(/([a-zA-Z]+)\s(\w\w)\s(\d\d\d-\d\d\d\d)$/)
  } 
  if (data == undefined) {
    data = line.match(/(.+)\W(\w\w)\W(\d+)-(\d+)/)
  }
  if (data == undefined) {
    data = line.match(/(.+)\W(\w\w)\W(\d+)-(\d+)/)
  }
  if (data == undefined) {
    // canadian city, province zip ()
    data = line.match(/(.+)\s(\w\w)\s(\w\w\w\s\w\w\w)/)
  }
  if (data == undefined) {
    // england city, province zip (LONDON ENGLAND X0 EC4P 4BQ)
    data = line.match(/([a-zA-Z]+)\s([a-zA-Z]+)\s([A-Za-z0-9 _]+)/)
  }
  return {city: data[1], state: data[2], zip_code: data[3]}
}

var isNumber = function(line) {
  var clean = line.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g, '')
  return parseInt(clean).toString() == clean;
}

var parseAddressArray = function(array) {
  var data = {};
  while (array.length >= 1) {
    if (data.city == undefined) {
      var line = array.pop();

      if (isNumber(line)) {
        
        data.phone = line;
      
      } else {
        _.extend(data, parseCityStateZip(line));
      }
    } else {
      if (array.length == 2) {
        data.street = array;
        array = [];
      } else {
        data.street = [array.shift()];   
      }
    }
  }

  return data;
}

module.exports = function(html) { 
  var $ = cheerio.load(html);
  var filerInfo = $('#filerDiv');
  // console.log(html);
  filerInfo = _.map(filerInfo.text().split("\n"), function(line) { return line.trim() });
  filerInfo = _.filter(filerInfo, function(line) { return line != ''});
  var data = splitCompanyRecords(filerInfo);
  return data
}
