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
      'a2c6d26db802e255f9ab7251f4a96ffa': read('html/filing/1018724/0000932471-18-004538-index.htm')
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
    describe('Amazon', function() { 
      it('parse  Form SC 13G/A 1018724/0000932471-18-004538', function(done) {
        var filing = new BrowseEdgar.filing({});
        filing.query({
          cik: '1018724', 
          accession: '0000932471-18-004538'
        }, function(err, result) {
          // console.log('0001127602-18-001998', result.subject);
          assert.equal(result.info.filing_date, '2018-02-12');
          assert.equal(result.files.documents.length, 2);
          assert.equal(result.info.accepted, '2018-02-12 09:17:53');
          assert.equal(result.info.documents, 1);
          assert.equal(result.info.type, 'Form SC 13G/A');
          assert.equal(result.info.accession, '0000932471-18-004538');
          assert.equal(result.filed_by.irs_no, '231945930');
          assert.equal(result.filed_by.state_of_incorp, 'pa');
          assert.equal(result.filed_by.fiscal_year_end, '1231type');
          assert.equal(result.filed_by.cik, '0000102909');
          assert.equal(result.filed_by.filed_by, 'VANGUARD GROUP INC');
          assert.equal(result.filed_by.mailing_address.city, 'VALLEY FORGE');
          assert.equal(result.filed_by.mailing_address.state, 'PA');
          assert.equal(result.filed_by.mailing_address.zip_code, '19482');
          assert.equal(result.filed_by.mailing_address.street[0], 'PO BOX 2600');
          assert.equal(result.filed_by.mailing_address.street[1], 'V26');
          assert.equal(result.filed_by.business_address.city, 'VALLEY FORGE');
          assert.equal(result.filed_by.business_address.state, 'PA');
          assert.equal(result.filed_by.business_address.zip_code, '19482');
          assert.equal(result.filed_by.business_address.street[0], 'PO BOX 2600');
          assert.equal(result.filed_by.business_address.street[1], 'V26');
          assert.equal(result.filed_by.business_address.phone, '6106691000');
          assert.equal(result.subject.irs_no, '911646860');
          assert.equal(result.subject.state_of_incorp, 'de');
          assert.equal(result.subject.fiscal_year_end, '1231type');
          assert.equal(result.subject.act, '34');
          assert.equal(result.subject.cik, '0001018724');
          assert.equal(result.subject.file_no, '005-53341');
          assert.equal(result.subject.film_no, '18594139sic');
          assert.equal(result.subject.subject, 'AMAZON COM INC');
          assert.equal(result.subject.mailing_address.city, 'SEATTLE');
          assert.equal(result.subject.mailing_address.state, 'WA');
          assert.equal(result.subject.mailing_address.zip_code, '98109');
          assert.equal(result.subject.mailing_address.street[0], '410 TERRY AVENUE NORTH');
          assert.equal(result.subject.business_address.city, 'SEATTLE');
          assert.equal(result.subject.business_address.state, 'WA');
          assert.equal(result.subject.business_address.zip_code, '98109');
          assert.equal(result.subject.business_address.street[0], '410 TERRY AVENUE NORTH');
          assert.equal(result.subject.business_address.phone, '2062661000');
          done();
        });
      });
    });
  });
});


