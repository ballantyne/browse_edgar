const klass       = require('klass');
const _           = require('underscore');
var cheerio       = require('cheerio');

module.exports = function(html) { 
  var $ = cheerio.load(html);
  // console.log('html', html)
  var header = _.reject(_.map($('#formDiv .formContent').text().split("\n"), function(string) { 
    return string.trim(); 
  }), function(clean) {
    return clean == '';
  });
  var titles = [];
  var data = [];
  var index = 1;
  var current_entry = [];
  for (i = 0; i < header.length; i++) {
    var item = header[i];
    if (index == 1) {
      titles.push(item.toLowerCase().split(' ').join('_'));      
      index += 1;
    } else {
      if (parseInt(item).toString() == item) {
        item = parseInt(item);
      }
      
      data.push(item);
      index = 1;
    }
  }
  var data = _.object(titles, data);
  data.description = $('#formDiv #formHeader #formName').text().trim().replace(':', '');
  data.type = data.description.split(' - ')[0];
  var secNumber = $('#formDiv #formHeader #secNum').text().trim();
  data.accession = secNumber.split('No. ')[1]
  return data
}

