/** @jsx React.DOM */
'use strict'
var ReactDOM = require('react-dom')
var React = require("react");
var Chart = require("./Chart");
var TickerForm = require("./TickerForm");
var TickerList = require("./TickerList");

var App = React.createClass({
    handleOnTickerAdd:function(ticker){
      var tickers = this.state.tickers;
      tickers.push(ticker);
      this.setState(tickers);
    },
    handleDeleteTicker:function(tickerIndex){
      var tickers = this.state.tickers;
      tickers.splice(tickerIndex,1);
      this.setState(tickers);
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