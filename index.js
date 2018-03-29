const path = require('path');

module.exports.filing         = require(path.join(__dirname, 'lib', 'filing'));
module.exports.search         = require(path.join(__dirname, 'lib', 'search'));
module.exports.request        = require(path.join(__dirname, 'lib', 'request'));
