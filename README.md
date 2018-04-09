browse-edgar
------------

The tests are just to test how well the module parses.  I haven’t ensured that they indicate anything specific about that company.  I was just verifying if my work is correct.  I think someone was commenting that they are wrong?  I think the proper response is job well done.  The example in the readme simply shows that maybe the founder of Facebook thought the price would drop on 3/14.  Not sure that it says more than that.  Finding the signal and what the signal means is something I am leaving up to the users of this library.  Maybe people should not jump to conclusions.  Or maybe now that the module seems like it works I could go and choose better examples that show a correlation between stock prices and when news stories break.  I would enjoy seeing what others make using this module. 

(I am not affiliated with the SEC.  I hope that they don't mind me making this module, maybe they will find it useful themselves)

This is a remake of a [classic](https://github.com/ballantyne/sec_entities).

## Installation
```bash
  npm install browse-edgar --save
```
### Responsible Use

As far as I know the SEC doesn't have an api and they don't have limits set that I know.  So it would be great if people use this module responsibly.  If you could include your name and phone number in the user agent, maybe they can call people that are producing to much traffic on their server.  Also, that way, you traffic will be differentiated from the others that are just installing the module and using it directly.  I hope that this method of accessing the data isn't restricted.  I think that other services that have this data must have also crawled and indexed the data in a similar way, so hopefully if people don't take advantage we can all have access to this information.

```javascript
var BrowseEdgar = require('browse-edgar');
var filing = new BrowseEdgar.filing({user_agent: 'FirstName LastName (Telephone)'});
filing.query({cik: '0001326801', accession: '0001127602-18-011629'}, function(err, result) {
  console.log(result);
});
```

### Filing

When downloading a filing, you need to supply the formatted accession number.  I think that there is probably a way to guess the format and then supply the numeric version, but I have not spent the time to do that.

```javascript
var BrowseEdgar = require('browse-edgar');
var filing = new BrowseEdgar.filing({});
filing.query({cik: '0001326801', accession: '0001127602-18-011629'}, function(err, result) {
  console.log(result);
});
```
### Search 

```javascript
var BrowseEdgar = require('browse-edgar');
var search = new BrowseEdgar.search({});
search.query({company: 'facebook'}, function(err, result) {
  console.log(result);
});
```

Donations
------------

* BTC: 1A1BrPyWpdXLPsidjaMAmyNG71vFwmKPSR
* BCH: qqhk5ce25fs706sk9vlnhtezpk3ezp9euc82cyky8v
* ETH: 0xC33DBB4D997e6A3d9457F41ff07fb13f8DA7bF64
* LTC: LS2P54xNErZ36pXp95zqTyST7XTx5XHEZy

Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your fix/feature has a high chance of being included, please read the following guidelines:

1. Post a [pull request](https://github.com/ballantyne/browse-edgar/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for paperclip, please open a
   [GitHub issue](https://github.com/ballantyne/browse-edgar/issues/new).

If there is a filing or search that doesn't work correctly, please add the information to the appropriate part of the [test cases file](https://github.com/ballantyne/browse_edgar/blob/master/test/utilities/test_cases.json) and run:
```bash
  npm run sync
```
That will download all of the test files and make sure that as your are fixing the library you don't break other test cases.  

If you run:
```bash
  npm test
```
It will run the sync command once at the beginning of the test run and then it will rerun the tests each time you save.

And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/browse-edgar/graphs/contributors)!

License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright
-------
© 2018 Scott Ballantyne. See LICENSE for details.

