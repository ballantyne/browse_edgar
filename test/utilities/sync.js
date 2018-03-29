var program   = require('commander');

program
  .version('0.1.0')
  .option('-r, --resync')
  .parse(process.argv);

var omitEmpty   = require('omit-empty');
var path        = require('path');
var fs          = require('fs');
var _           = require('underscore');
var request     = require('request');
var querystring = require('querystring');
var uri         = require('url');

var testCases   = require(path.join(__dirname, 'test_cases'));

var BrowseEdgar = require(path.join(__dirname, '..', '..', 'index'));
var search = new BrowseEdgar.search({});
var filing = new BrowseEdgar.filing({});

var urls = _.flatten([
  _.map(testCases.search, function(options) {
    var url = search.url(options);
    var query = omitEmpty(querystring.parse(uri.parse(url).query));
    file = ['browse-edgar?',querystring.stringify(query)].join('')
    return {
      url: url,
      type: 'search',
      destination: path.join(__dirname, '..', 'html', 'search'),
      file: file,
      params: options
    }
  }), 
  _.map(testCases.filing, function(key) {
    var cik = parseInt(key).toString();
    return  _.map(testCases.filing[key], function(c) {
      var numericAccession = c.split('-').join('');
      var url = filing.url({cik: cik, accession: c});
      return {
	type: 'filing', 
	url: url, 
	accession: c, 
	cik: cik, 
	destination: path.join(__dirname, '..', 'html', 'filing', cik),
	file: c+'-index.htm'
      };
    })
  })
])

var downloadPages = function() {
  var loop = setInterval(function() {
    var url = urls.pop()
    if (fs.existsSync(path.join(url.destination, url.file)) == false || program.resync) {
      request.get({
        url: url.url
      }, function(err, response, body) {
        console.log(url);

        if (fs.existsSync(url.destination) == false) {
          fs.mkdirSync(url.destination);
        }
        fs.writeFileSync(path.join(url.destination, url.file), body);
      })
    }

    if (urls.length == 0) {
      clearInterval(loop);
    }
  }, 1000)
}

downloadPages();
