const klass       = require('klass');
const request     = require('request');
const _           = require('underscore');
const querystring = require('querystring');

module.exports = klass(function(options) {
  _.extend(this, options);

  if (this.protocol == undefined) {
    this.protocol   = 'https';
  }
  
  if (this.host == undefined) {
    this.host       = 'www.sec.gov';
  }
  
  if (this.user_agent == undefined) {
    this.user_agent = 'browse-edgar npm module';
  }
    
}).methods({

  get: function(options, then) {
    var self = this;
    options.method = 'GET';
    options.headers = {
      "Upgrade-Insecure-Requests": 1,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "User-Agent": this.user_agent
    };
    options.gzip = true;
    request(options, function(err, response, body) {
      then(err, body);
    });
  },

  post: function(options, then) {
    var self = this;
    options.json = body;
    options.url    = url;
    options.method = 'POST';
    options.headers = {
      "Upgrade-Insecure-Requests": 1,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Referrer": "Referer:https://www.sec.gov/Archives/edgar/data/1326801/000112760218012597/0001127602-18-012597-index.htm",
      "User-Agent": this.user_agent
    };
    options.gzip = true;
    request(options, function(err, response, body) {
      then(err, body);
    }); 
  }

})
