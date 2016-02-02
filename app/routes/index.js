'use strict'
var path = process.cwd();
var StockHandler = require(path + '/app/controllers/stockHandler.server.js');
module.exports = function (app) {
	var stockHandler = new StockHandler();
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/api/stock/ticker/:ticker')
		.get(stockHandler.stockExists);
		
	app.route('/api/stock/search/:ticker')
		.get(stockHandler.search);
	app.route('/api/stock/:ticker')
		.get(stockHandler.getStock);


    
}