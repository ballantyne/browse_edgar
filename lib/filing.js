const path           = require('path');
const Request        = require(path.join(__dirname, 'request'));
const _              = require('underscore');
var FilingInfo       = require(path.join(__dirname, 'filing', 'info'));
var FilingDocuments  = require(path.join(__dirname, 'filing', 'documents'));
var FilingData       = require(path.join(__dirname, 'filing', 'data'));
var FilingFilers     = require(path.join(__dirname, 'filing', 'parse_filer'));

module.exports = Request.extend(function(options) {
   
}).methods({

  url: function(params) {
    return [
      this.protocol, "://", this.host, '/Archives/edgar/data/', 
      parseInt(params.cik).toString(),'/', params.accession.split('-').join(''),'/', params.accession,'-index.html'
    ].join('');
  },

  query: function(params, then) {
    var self = this;
    var options = {};
    options.url    = this.url(params);
    this.get(options, function(err, html) {
      data = self.parseFiling(html);
      then(err, data);
    });
  },

  parseFilingInfo: function(html) {
    var info = FilingInfo(html); 
    return info;
  },

  parseDocuments: function(html) {
    var documents = FilingDocuments(html);    
    return documents;
  },

  parseDataFiles: function(html) {
    var data = FilingData(html)    
    return data;
  },

  parseFilers: function(html) {
    var filers = FilingFilers(html) 
    return filers;
  },

  parseFiling: function(html) {
    var filer             = {};
    filer.files           = {};
    filer.info            = this.parseFilingInfo(html);
    var documents = this.parseDocuments(html);
    var data      = this.parseDataFiles(html);
    if (documents.length > 0) {
      filer.files.documents = documents;
    }

    if (data.length > 0) {
      filer.files.data = data;
    }   
    
    _.extend(filer, this.parseFilers(html));

    return filer;
  }
})
