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
      'd08db74d8be3d475debca3ed536bc9f2': read('html/filing/101199/0000101199-18-000040-index.htm')
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
    describe('United Fire Group', function() { 
      it('parse Form 10-K 0000101199/0000101199-18-000040', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '0000101199', 
          accession: '0000101199-18-000040'
        }, function(err, result) {
          // console.log('0000101199-18-000040', result);
          assert.equal(result.info.filing_date, '2018-02-28');
          // assert.equal(result.files.documents.length, 3);
          // assert.equal(result.info.accepted, '2018-03-15 12:42:55');
          // assert.equal(result.info.documents, 2);
          // assert.equal(result.info.period_of_report, '2018-03-09');
          // assert.equal(result.info.type, 'Form 8-K');
          // assert.equal(result.info.accession, '0000352541-18-000033');
          // assert.equal(result.filer.irs_no, '391380265');
          // assert.equal(result.filer.state_of_incorp, 'wi');
          // assert.equal(result.filer.fiscal_year_end, '1231type');
          // assert.equal(result.filer.act, '34');
          // assert.equal(result.filer.file_no, '001-09894');
          // assert.equal(result.filer.film_no, '18691738sic');
          // assert.equal(result.filer.filer, 'ALLIANT ENERGY CORP');
          // assert.equal(result.filer.mailing_address.city, 'MADISON');
          // assert.equal(result.filer.mailing_address.state, 'WI');
          // assert.equal(result.filer.mailing_address.zip_code, '53718');
          // assert.equal(result.filer.mailing_address.street[0], '4902 NORTH BILTMORE LANE');
          // assert.equal(result.filer.mailing_address.street[1], 'SUITE 1000');
          // assert.equal(result.filer.business_address.city, 'MADISON');
          // assert.equal(result.filer.business_address.state, 'WI');
          // assert.equal(result.filer.business_address.zip_code, '53718');
          // assert.equal(result.filer.business_address.street[0], '4902 NORTH BILTMORE LANE');
          // assert.equal(result.filer.business_address.street[1], 'SUITE 1000');
          // assert.equal(result.filer.business_address.phone, '608-458-3311');
 
          done();
        });
      });
    });
  });
});


