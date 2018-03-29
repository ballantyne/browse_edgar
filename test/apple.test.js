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
      '1a1cde61c763b64a8cffea1b1ab9e9b7': read('html/filing/320193/0001193125-18-073716-index.htm')
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
    describe('Apple', function() { 
      it('parse Form SD 0000320193/0001193125-18-073716', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '0000320193', 
          accession: '0001193125-18-073716'
        }, function(err, result) {
          // console.log('0001127602-18-001998', result.filer);
          assert.equal(result.info.filing_date, '2018-03-07');
          assert.equal(result.files.documents.length, 7);
          assert.equal(result.info.accepted, '2018-03-07 17:26:18');
          assert.equal(result.info.documents, 6);
          assert.equal(result.info.type, 'Form SD -');
          assert.equal(result.info.accession, '0001193125-18-073716');
          assert.equal(result.filer.irs_no, '942404110');
          assert.equal(result.filer.state_of_incorp, 'ca');
          assert.equal(result.filer.fiscal_year_end, '0930type');
          assert.equal(result.filer.act, '34');
          assert.equal(result.filer.file_no, '001-36743');
          assert.equal(result.filer.film_no, '18674202sic');
          assert.equal(result.filer.cik, '0000320193');
          assert.equal(result.filer.filer, 'APPLE INC');
          assert.equal(result.filer.mailing_address.city, 'CUPERTINO');
          assert.equal(result.filer.mailing_address.state, 'CA');
          assert.equal(result.filer.mailing_address.zip_code, '95014');
          assert.equal(result.filer.mailing_address.street[0], 'ONE APPLE PARK WAY');
          assert.equal(result.filer.business_address.city, 'CUPERTINO');
          assert.equal(result.filer.business_address.state, 'CA');
          assert.equal(result.filer.business_address.zip_code, '95014');
          assert.equal(result.filer.business_address.street[0], 'ONE APPLE PARK WAY');
          assert.equal(result.filer.business_address.phone, '(408) 996-1010');
 
          done();
        });
      });
    });
  });
});


