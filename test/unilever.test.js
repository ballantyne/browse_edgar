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
      'dc569ab47c314cad30c37e35e33e2861': read('html/filing/217410/0001104659-18-019482-index.htm')
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
    describe('Unilever', function() { 
      it('parse Form 6-K 0000217410/0001104659-18-019482', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '0000217410', 
          accession: '0001104659-18-019482'
        }, function(err, result) {
          // console.log('0001104659-18-019482', result);
          assert.equal(result.info.filing_date, '2018-03-22');
          assert.equal(result.filer.mailing_address.city, 'ENGLEWOOD CLIFFS');
          assert.equal(result.filer.mailing_address.state, 'NJ');
          assert.equal(result.filer.mailing_address.zip_code, '07632');
          assert.equal(result.filer.business_address.city, 'LONDON');
          assert.equal(result.filer.business_address.state, 'ENGLAND');
          assert.equal(result.filer.business_address.zip_code, 'X0 EC4P 4BQ');
          assert.equal(result.filer.business_address.phone, '201-894-2790');
 
          done();
        });
      });
    });
  });
});


