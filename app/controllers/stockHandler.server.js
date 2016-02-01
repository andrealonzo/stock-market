'use strict';

var https = require("https");

function StockHandler() {

    this.getStock = function(req, response) {

        var accessToken = process.env.QUANDL_API_KEY;
        var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + 
            req.params.ticker + 
            '.json?auth_token=' +
            accessToken +
            '&collapse=monthly&start_date=2000-01-01&end_date=2016-01-15';

        https.get(url, function(res) {
            var body = '';

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                response.json(JSON.parse(body));
            });
        }).on('error', function(e) {
            console.log("Got an error: ", e);
            response.json(e);
        });
    };


}

module.exports = StockHandler;