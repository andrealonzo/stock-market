'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');

var app = express();
require('dotenv').load();

app.use('/css', express.static(process.cwd() + '/public/css'));
app.use('/js', express.static(process.cwd() + '/public/js'));
	app.route('/')
		.get(function (req, res) {
			res.sendFile(process.cwd() + '/public/index.html');
		});
		

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});