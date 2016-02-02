/** @jsx React.DOM */
'use strict'
var ReactDOM = require('react-dom')
var React = require("react");
var Chart = require("./Chart");
var TickerForm = require("./TickerForm");
var TickerList = require("./TickerList");
var Message = require("./Message");
var $ = require('jquery');

var App = React.createClass({
    handleOnTickerAdd:function(ticker){
        this.addTicker(ticker,true);
    },
    addTicker:function(ticker,addedByCurrentUser){
        var tickers = this.state.tickers.slice();
      //check to see if ticker is already in list
      if(tickers.indexOf(ticker.toUpperCase())!=-1){
           //only show this message if current user added the ticker
          if(addedByCurrentUser){
              this.setState({
                  message:ticker + " is already in the list"
              });
          }
        return;
      }
      
      //check to see if ticker exists
      var apiUrl = '/api/stock/ticker/' + ticker;
      $.getJSON( apiUrl, function( data ) {
          if(data.ticker){
              var tickers = this.state.tickers.slice();
              tickers.push(data.ticker);
              this.setState({
                  tickers:tickers,
                  message:null,
                  loading:true
              });
              //send out socket signal if ticker was added by current user
              if(addedByCurrentUser){
                 this.socket.emit('addTicker', data.ticker);
              }
          }
          else{
              //only show this message if current user added the ticker
               if(addedByCurrentUser){
                     this.setState({
                      message:ticker + " doesn't exist"
                  });
               }
          }
      }.bind(this));
        
    },
    handleDeleteTicker:function(tickerIndex){
      
      this.removeTicker(tickerIndex, true);
    },
    removeTicker:function(tickerIndex, removedByCurrentUser){
     var tickers = this.state.tickers.slice();
      var ticker = tickers[tickerIndex];
      tickers.splice(tickerIndex,1);
      this.socket.emit('removeTicker', ticker);
      this.setState({
          tickers:tickers,
          loading:true
      });
     
    },
    handleMessageClose:function(){
      this.setState({
          message:null
      }); 
    },
    getInitialState:function(){
      return{
          tickers: ["AAPL", "MSFT", 'AMZN', 'GOOG'],
          loading:true,
          numUsers:0
      }  
    },
    handleChartLoaded:function(){
      console.log("Chart loaded");  
      this.setState({
          loading:false
      })
    },
    componentDidMount:function(){
		this.socket = io();
		this.socket.on('addTicker', function (ticker) {
		    console.log('received addticker', ticker);
		    this.addTicker(ticker);
		}.bind(this));
		
		this.socket.on('removeTicker', function (ticker) {
		    console.log('received removeTicker', ticker);
		    var tickers = this.state.tickers.slice();
            var tickerIndex = tickers.indexOf(ticker);
            console.log(tickers, tickerIndex);
            if(tickerIndex !=-1){
                this.removeTicker(tickerIndex);
            }
		}.bind(this));
		
		this.socket.on('numUsers', function(numUsers){
		    this.setState({
		        numUsers:numUsers
		    })
		}.bind(this));
		
    },
    render: function() {
        return (
           
        <div className="container text-center">
            <h1>StockChartr</h1>
            {this.state.numUsers} speculator{this.state.numUsers!=1?'s':null} currently online
            <Chart tickers = {this.state.tickers} onChartLoaded={this.handleChartLoaded}/>
            <TickerForm onTickerAdd = {this.handleOnTickerAdd}/>
            {this.state.message?<Message message={this.state.message} onMessageClose={this.handleMessageClose}/>:null}
            {this.state.loading?<img src="/img/flickr.gif" height="20px"/>:null}
            <p/>
            <TickerList tickers = {this.state.tickers} onDeleteTicker={this.handleDeleteTicker} />
        </div>
        )
    }
});


ReactDOM.render(
    <App/>,
    document.getElementById('app')
);