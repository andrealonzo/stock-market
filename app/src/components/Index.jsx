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
              tickers.push(data.ticker);
              this.setState({
                  tickers:tickers,
                  message:null
              });
          }
          else{
             this.setState({
              message:ticker + " doesn't exist"
          });
          }
      }.bind(this));
    },
    handleDeleteTicker:function(tickerIndex){
      var tickers = this.state.tickers.slice();
      tickers.splice(tickerIndex,1);
      this.setState({tickers:tickers});
    },
    handleMessageClose:function(){
      this.setState({
          message:null
      }); 
    },
    getInitialState:function(){
      return{
         // tickers: ["AAPL", "MSFT", 'AMZN', 'GOOG', 'CSCO', 'C', 'HD']
          tickers: ["AAPL", "MSFT", 'AMZN', 'GOOG']
      }  
    },
    render: function() {
        return (
           
        <div className="container text-center">
            <h1>StockChartr</h1>
            <Chart tickers = {this.state.tickers}/>
            <TickerForm onTickerAdd = {this.handleOnTickerAdd}/>
            {this.state.message?<Message message={this.state.message} onMessageClose={this.handleMessageClose}/>:null}
           
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