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
      'd73f42efec48ab624125a65231c5b2aa': read('html/filing/313838/0001157523-18-000447-index.htm')
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
    describe('Sony', function() { 
      it('parse Form 6-K 0000313838/0001157523-18-000447',function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '0000313838', 
          accession: '0001157523-18-000447'
        }, function(err, result) {
          // console.log('0001157523-18-000447', result.filer);
          assert.equal(result.info.filing_date, '2018-02-28');
          assert.equal(result.filer.mailing_address.city, 'TOKYO');
          assert.equal(result.filer.mailing_address.zip_code, '108-0075');
          assert.equal(result.filer.mailing_address.state, 'M0');
          assert.equal(result.filer.business_address.city, 'TOKYO');
          assert.equal(result.filer.business_address.state, 'M0');
          assert.equal(result.filer.business_address.zip_code, '108-0075');
          assert.equal(result.filer.business_address.phone, '81-3-6748-2111');
 
          done();
        });
      });
    });
  });
});


