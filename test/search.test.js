var path          = require('path');
var mockery       = require('mockery');
var should        = require('chai').should();
var request       = require('request-mockery');
var assert        = require('assert');
var _             = require('underscore');
var fs            = require('fs');
const url         = require('url');
const querystring = require('querystring');
var read          = require(path.join(__dirname, 'utilities', 'read'));

describe('SEC', function() {
  var BrowseEdgar, key;
  before(function(){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    var responses = {
      "231cfbcbf15c957c9769fd4957e3b09c": read('html/search/browse-edgar?company=microsoft&myowner=exclude&action=getcompany'), 
      "aef39b12f9273859a9a1b1edc4b67934": read('html/search/browse-edgar?company=google&myowner=exclude&action=getcompany'),
      "368a1b3803a1ef7ef20618f79639e9c6": read('html/search/browse-edgar?company=uber&myowner=exclude&action=getcompany'),
      "2868557a521af9c69b07fed4a97ffdea": read('html/search/browse-edgar?company=sap&myowner=exclude&action=getcompany'),
      "57f56ec486acd249560655b0e9e1f370": read('html/search/browse-edgar?company=facebook&myowner=exclude&action=getcompany'),
      "378560c0db972c70043324cf1e97f7d8": read('html/search/browse-edgar?company=alliant&myowner=exclude&action=getcompany'),
      "10855892076611bc287353bbc4acb681": read('html/search/browse-edgar?company=alliant&myowner=exclude&action=getcompany&start=40&count=40&hidefilings=0'),
      'e14307d59f35fa65400cf8b8c915464a': read('html/search/browse-edgar?State=IA&myowner=exclude&action=getcompany'),
      '5a01bc8ad051ffa2ac6d92b772aec907': read('html/search/browse-edgar?Country=F4&myowner=exclude&action=getcompany')
    };
    request.responses(responses);
    request.verbosity(true);
    mockery.registerMock('request', request);
    BrowseEdgar = require(path.join(__dirname, '..', 'index'));
  });

  after(function(){
    mockery.disable();
  }); 

  describe('BrowseEdgar', function() {
    describe('Search', function() { 
      it('{company: "uber"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'uber' 
        }, function(err, results) {
          var result = _.first(results);
          assert.equal(results.length > 0, true);
          done();
        });
      });

      it('{company: "google"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'google' 
        }, function(err, results) {
          var result = _.first(results);
          assert.equal(results.length > 0, true);
          done();
        });
      });

      it('{company: "microsoft"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'microsoft' 
        }, function(err, results) {
          var result = _.first(results);
          assert.equal(results.length > 0, true);
          done();
        });
      });

      it('{company: "sap"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'sap' 
        }, function(err, results) {
          var result = _.first(results);
          assert.equal(results.length > 0, true);
          done();
        });
      });

      it('{company: "facebook"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'facebook' 
        }, function(err, results) {
          var result = _.first(results);
          assert.equal(results.length > 0, true);
          done();
        });
      });

      it('{company: "alliant"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'alliant' 
        }, function(err, results) {
          var result = _.first(_.where(results, {cik: '0001292450'}));

          // console.log('alliant', results);
          assert.equal(result.filings, 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001292450&owner=include&count=40&hidefilings=0');
          assert.equal(result.state, 'Virginia');
          assert.equal(result.cik, '0001292450');
          assert.equal(result.company, 'Alliant Ammunition & Powder CO LLC');
          done();
        });
      });

      it('{company: "alliant", start: 40, count: 40, hidefilings=0}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          company: 'alliant',
          start: 40,
          count: 40,
          hidefilings: 0
        }, function(err, results) {
          var result = _.first(_.where(results, {cik: '0001177872'}));
          // console.log('alliant', results);
          assert.equal(result.filings, 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001177872&owner=include&count=40&hidefilings=0');
          assert.equal(result.state, undefined);
          assert.equal(result.cik, '0001177872');
          assert.equal(result.company, 'ALLIANT TAX CREDIT FUND XVIII LTD');
          done();
        });
      });

      it('{State: "IA"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          State: 'IA',
        }, function(err, results) {
          var result = _.first(_.where(results, {cik: '0001267947'}));

          // console.log('Iowa', results);
          assert.equal(result.filings, 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001267947&owner=include&count=40&hidefilings=0');
          assert.equal(result.state_code, "IA");
          assert.equal(result.state, "Iowa");
          assert.equal(result.cik, '0001267947');
          assert.equal(result.company, '100 COURT INVESTORS LLC TIG-1 LLC');
          done();
        });
      });


      it('{Country: "China"}', function(done) {
        var search = new BrowseEdgar.search({});
        search.query({
          Country: 'China',
        }, function(err, results) {
          var r = _.where(results, {cik: '0001340589'})[0]
          assert.equal(r.filings, 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001340589&owner=include&count=40&hidefilings=0');
          assert.equal(r.country, 'CHINA');
          assert.equal(r.country_code, 'F4');
          assert.equal(r.cik, '0001340589');
          assert.equal(r.company, '100E LTD');
          done();
        });
      });
    });
  });
});


