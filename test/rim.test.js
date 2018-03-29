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
      'ab197a6a7645364d4d77c9f1bb20abd5': read('html/filing/1070235/0001070235-18-000007-index.htm')
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
    describe('RIM', function() { 
      it('parse Form 40-F 0001070235/0001070235-18-000007', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '0001070235', 
          accession: '0001070235-18-000007'
        }, function(err, result) {
          // console.log('0001070235-18-000007', result);
          assert.equal(result.info.filing_date, '2018-03-28');
          assert.equal(result.filer.mailing_address.city, 'WATERLOO');
          assert.equal(result.filer.mailing_address.state, 'A6');
          assert.equal(result.filer.mailing_address.zip_code, 'N2K 0A7');
          assert.equal(result.filer.business_address.city, 'WATERLOO');
          assert.equal(result.filer.business_address.state, 'A6');
          assert.equal(result.filer.business_address.zip_code, 'N2K 0A7');
          assert.equal(result.filer.business_address.phone, '5198887465');
 
          done();
        });
      });
    });
  });
});


