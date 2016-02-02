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
		
routes(app);
var currentUsers = 0;
io.on('connection', function(socket){
  currentUsers++;
  console.log('User connected');
  console.log('Number of users online', currentUsers);
  
  io.emit('numUsers', currentUsers);
  socket.on('addTicker', function(ticker){
      
    socket.broadcast.emit('addTicker', ticker);
    
  });
  
  socket.on('removeTicker', function(ticker){
    socket.broadcast.emit('removeTicker', ticker);
    
    
  });
  socket.on('disconnect', function(){
      currentUsers--;
      console.log('User disconnected');
      console.log('Number of users online', currentUsers);
      io.emit('numUsers', currentUsers);
  });
});
		
var port = process.env.PORT || 8080;

http.listen(port, function(){
	console.log('Node.js listening on port ' + port + '...');
});