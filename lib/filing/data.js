
const path        = require('path');
const ParseTable  = require(path.join(__dirname, 'parse_table'));

module.exports = function(html) {
  return ParseTable('Data Files', html);
}

