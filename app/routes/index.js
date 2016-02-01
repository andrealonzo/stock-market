'use strict'
module.exports = function (app) {
    var path = process.cwd();
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
    
}