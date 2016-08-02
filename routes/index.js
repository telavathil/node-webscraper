var express = require('express');
var router = express.Router();
var request = require('request');
let cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {

  function getSubstackImages() {
    request("http://substack.net/images/", function(error, response, html) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        var writer = csvWriter({ headers: ["File Permission", "Absolute URL", "File Type"]});
        writer.pipe(fs.createWriteStream('out.csv'));

        $('tr').each(function (i, elm) {
          var filePermission = '';
          var absUrl = 'http://substack.net/images/';
          var fileType = ''

          filePermission = $(elm).first().find('code').text().substr(0,12);
          absUrl += $(elm).first().find('a').text();
          fileType = $(elm).first().find('a').text().substr(-3);

          writer.write([filePermission,absUrl,fileType]);
        });

        writer.end();
      }



    });
  }
  getSubstackImages();
  res.render('index', { title: 'Express' });
});

module.exports = router;
