
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
      '6782b0d85acf38114b66eae2d3deab57': read('html/filing/999999000123123/0000999999-18-000033112000-index.htm')
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
    describe('Not Found', function() { 
      it('parse Form 8-K 999999000123123/0000999999-18-000033112000', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '999999000123123', 
          accession: '0000999999-18-000033112000'
        }, function(err, result) {
          // console.log('0000352541-18-000033', result);
          assert.equal(result.status, 503);
 
          done();
        });
      });
    });
  });
});

