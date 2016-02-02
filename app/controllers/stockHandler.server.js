'use strict';

var https = require("https");    
var path = process.cwd();
var tickers=require(path + '/app/data/tickers.json');

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
    
    
    this.search = function(req,res){
        var searchTerm = req.params.ticker;
        var filteredTickers = tickers.filter(function(value){
        return(
           value.ticker.toLowerCase().indexOf(searchTerm.toLowerCase()) !=-1  ||
           value.company.toLowerCase().indexOf(searchTerm.toLowerCase()) !=-1
           );
        });
        
        var sortedTickers = filteredTickers.sort(function(ticker1,ticker2){
            
            var ticker1Index = ticker1.ticker.toLowerCase().indexOf(searchTerm.toLowerCase());
            var ticker2Index = ticker2.ticker.toLowerCase().indexOf(searchTerm.toLowerCase());
            
            var tickerCompany1Index = ticker1.company.toLowerCase().indexOf(searchTerm.toLowerCase());
            var tickerCompany2Index = ticker2.company.toLowerCase().indexOf(searchTerm.toLowerCase());
            

            if( (ticker1Index == 0) && !(ticker2Index ==0)  ) {
                return -2;
            }
            else if( (tickerCompany1Index == 0) && !(tickerCompany2Index ==0)  ) {
                return -1;
            }
            else if( (tickerCompany2Index ==0)  && !(tickerCompany1Index == 0) ){
                return 1;
            } 
            else if( (ticker2Index ==0)  && !(ticker1Index == 0) ){
                return 2;
            } 
            else{
                
             return ticker1.ticker.length - ticker2.ticker.length;
            }
        });
        
        //sort results by best match
        res.json(sortedTickers);
    }
    
    this.stockExists = function(req,res){
        res.json(getTicker(req.params.ticker, tickers));

    }
    
    function getTicker(tickerToFind, tickers) {
        for(var i = 0; i < tickers.length;i++){
            var ticker = tickers[i];
            if(ticker.ticker.toLowerCase() == tickerToFind.toLowerCase()){
                return ticker;
            }
        }

    return {};
}


}

module.exports = StockHandler;