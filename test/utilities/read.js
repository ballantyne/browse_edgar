var path          = require('path');
var fs            = require('fs');

module.exports = function(name) {
  return fs.readFileSync(path.join(__dirname, '..', name)).toString();
}

