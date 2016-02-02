'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');

var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

require('dotenv').load();

app.use('/css', express.static(process.cwd() + '/public/css'));
app.use('/js', express.static(process.cwd() + '/public/js'));
app.use('/img', express.static(process.cwd() + '/public/img'));
app.use('/test.html', express.static(process.cwd() + '/public/test.html'));
		
routes(app);

io.on('connection', function(socket){
  socket.on('addTicker', function(ticker){
      
    socket.broadcast.emit('addTicker', ticker);
    
  });
  
  socket.on('removeTicker', function(ticker){
    socket.broadcast.emit('removeTicker', ticker);
    
  });
});
		
var port = process.env.PORT || 8080;

http.listen(port, function(){
	console.log('Node.js listening on port ' + port + '...');
});