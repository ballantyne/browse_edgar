const path        = require('path');
const Request     = require(path.join(__dirname, 'request'));
const _           = require('underscore');
const querystring = require('querystring');
const uri         = require('url');
var cheerio       = require('cheerio');
var taffy         = require('taffy');

var states        = taffy(require(path.join(__dirname, 'search_parameters', 'states')));
var countries     = taffy(require(path.join(__dirname, 'search_parameters', 'countries')));

const ParseTable  = require(path.join(__dirname, 'filing', 'parse_table'));

module.exports = Request.extend(function(options) {
   
}).methods({

  codeFromParams: function(params) {
    if (params.State != '') {
      var state = states({name:{like:params.State.toUpperCase()}});
      if (state.first() == false) {
        var state = states({code: {like:params.State.toUpperCase()}});
      }
      params.State = state.first().code;
    }
    if (params.Country != '') {
      var country = countries({name:{like: params.Country.toUpperCase()}});
      params.Country = country.first().code;
    }
    return params;
  }, 
 
  nameFromCode: function(params) {
    if (params.state != '' && params.state != undefined) {
      var state = states({code: {like: params.state.toUpperCase()}});
      if (state.first() == false) {
        var state = states({code: {like: params.state.toUpperCase()}});
      }
      if (state.first() != false) {
        params.state_code = params.state;
        params.state = state.first().name;
      }
      var country = countries({code:{like: params.state.toUpperCase()}});
      if (country.first() != false) {
        params.country = country.first().name;
        params.country_code = params.state;
        delete params.state;
      }
    }
    return params;
  },

  defaultParams: function(options) {
    var params = {
      company:'',
      match: '', 
      filenum:"",
      State:"", 
      Country:"", 
      SIC:"", 
      myowner:"exclude", 
      action: "getcompany"
    }
    _.extend(params, options);
    params = this.codeFromParams(params);
   return params;
  },

  url: function(query) {
    query = this.defaultParams(query);
    var url    = [
      this.protocol, "://", this.host, '/cgi-bin/browse-edgar', '?', querystring.stringify(query)
    ].join('');
    return url;
  },

  query: function(query, then) {
    var self = this;
    var url = this.url(query);
    this.get({url: url}, function(err, html) {
      var rows = self.parse(url, html);
      then(err, rows);
    });
  },

  parseUrl: function(url) {
    var parsed = uri.parse(url);
    var query = querystring.parse(parsed.query);
    return query;
  },

  parse: function(url, html) {
    var $ = cheerio.load(html);
    var companyMatch = $('span.companyMatch').text();
    var companyList = companyMatch.match(/Companies/);
    if (companyList != undefined) {
      return this.parseCompanyList(url, html);
    } else {
      return this.parseFilingList(url, html);
    }
  },

  parseCompanyList: function(url, html) {
    var self = this;
    return _.map(ParseTable('#seriesDiv table.tableFile2', html), function(row) {
      if (row["state/country"] != undefined) {
        var state = row["state/country"].match(/State=(\w+)/)[1];
      }
      var cik = row.cik.match(/CIK=(\d+)&/)[1];
      return self.nameFromCode({
        company: row.company,
        state: state,
        cik: cik,
        filings: row.cik
      })
    });
  },

  parseFilingList: function(url, body) {
    var $ = cheerio.load(body);  
    var results = [];
    var cells = $('#seriesDiv table.tableFile2 tr td');  
    var index = 0;
    var result = {};
    for (i = 0; i < cells.length; i++) { 
     var cell = cells[i];
      if (index == 0) {
        if (cell.children.length > 0) {
          result.count = parseInt(cell.children[0].data);
        }
      }
      if (index == 1) {
        var element = cell.children[0];
        if (element && element.attribs && element.attribs.href != undefined) {
          result.link = ['https://www.sec.gov',element.attribs.href].join('');
          var match = result.link.match(/.+data\/(.+)\/(.+)\/(.+)-(.+)-(.+)-(.+)/);
          result.issuer_cik = match[1];
          result.accession = {
            number: match[2]
          };
        }
      }
      if (index == 2) {
        if (cell.children[0] != undefined) {
          result.description = cell.children[0].data;
        }
        if (cell.children[2] != undefined) {
          var meta = cell.children[2].data.trim();
          match = meta.match(/Acc-no: (.+) Size: (.+) KB/);
          result.accession.formatted = match[1];
          result.kb = parseInt(match[2]);
        }
      }

      if (index == 3) {
        if (cell.children[0] != undefined) {
          result.date = new Date(cell.children[0].data);
        }
      } 
      if (index == 4){
        index = 0;
        results.push(result);
        result = {}; 
      } else {
        index += 1;
      }
    }
    return results;
  }
})
