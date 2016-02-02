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
      var tickers = this.state.tickers.slice();
      //check to see if ticker is already in list
      if(tickers.indexOf(ticker.toUpperCase())!=-1){
          this.setState({
              message:ticker + " is already in the list"
          });
        return;
      }
      
      //check to see if ticker exists
      var apiUrl = '/api/stock/ticker/' + ticker;
      $.getJSON( apiUrl, function( data ) {
          if(data.ticker){
              this.addTicker(data.ticker);
              this.socket.emit('addTicker', data.ticker);
          }
          else{
             this.setState({
              message:ticker + " doesn't exist"
          });
          }
      }.bind(this));
    },
    addTicker:function(ticker){
        
        var tickers = this.state.tickers.slice();
        tickers.push(ticker);
              this.setState({
                  tickers:tickers,
                  message:null,
                  loading:true
              });
    },
    handleDeleteTicker:function(tickerIndex){
      var tickers = this.state.tickers.slice();
      var ticker = tickers[tickerIndex];
      tickers.splice(tickerIndex,1);
      this.socket.emit('removeTicker', ticker);
      this.setState({
          tickers:tickers,
          loading:true
      });
    },
    removeTicker:function(ticker){
      var tickers = this.state.tickers.slice();
      var tickerIndex = tickers.indexOf(ticker);
      if(tickerIndex !=-1){
          tickers.splice(tickerIndex,1);
          this.setState({
              tickers:tickers,
              loading:true
          });
      }
    },
    handleMessageClose:function(){
      this.setState({
          message:null
      }); 
    },
    getInitialState:function(){
      return{
          tickers: ["AAPL", "MSFT", 'AMZN', 'GOOG'],
          loading:true
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
		    this.removeTicker(ticker);
		}.bind(this));
    },
    render: function() {
        return (
           
        <div className="container text-center">
            <h1>StockChartr</h1>
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