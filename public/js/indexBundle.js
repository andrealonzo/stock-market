/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM *//** @jsx React.DOM */
	'use strict'
	var ReactDOM = __webpack_require__(1)
	var React = __webpack_require__(2);
	var Chart = __webpack_require__(3);
	var TickerForm = __webpack_require__(4);
	var TickerList = __webpack_require__(5);

	var App = React.createClass({displayName: "App",
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
	           
	        React.createElement("div", {className: "container text-center"}, 
	            React.createElement("h1", null, "StockChartr"), 
	            React.createElement(Chart, {tickers: this.state.tickers}), 
	            React.createElement(TickerForm, {onTickerAdd: this.handleOnTickerAdd}), 
	            React.createElement("p", null), 
	            React.createElement(TickerList, {tickers: this.state.tickers, onDeleteTicker: this.handleDeleteTicker})
	        )
	        )
	    }
	});


	ReactDOM.render(
	    React.createElement(App, null),
	    document.getElementById('app')
	);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM *//** @jsx React.DOM */
	'use strict'
	var React = __webpack_require__(2);

	module.exports = React.createClass({displayName: "module.exports",
	     totalJSON:[],
	     chart:null,
	     gatherData:function(url, done) {
	        d3.json(url, function(data) {
	    
	            data = this.type(data);
	            this.totalJSON.push(data);
	            done();
	        }.bind(this));
	    },
	    type:function(data) {
	        var newDataset = {}
	        newDataset.key = data.dataset.dataset_code;
	        var format = d3.time.format("%Y-%m-%d");
	        newDataset.values = [];
	        data.dataset.data.forEach(function(value) {
	            var newData = [];
	            newData.push(format.parse(value[0]).getTime());
	            newData.push(value[4]);
	            newDataset.values.unshift(newData);
	        });
	        return newDataset;
	    },
	    apiUrl:function(ticker) {
	        return 'https://www.quandl.com/api/v3/datasets/WIKI/' + ticker + '.json?auth_token=QfNWrHRUVDFsc4VnixRr&collapse=monthly&start_date=2000-01-01&end_date=2016-01-15'
	    },
	    
	     chartStocks:function(data) {
	        nv.addGraph(function() {
	            var chart = nv.models.lineWithFocusChart();
	            this.chart = chart;
	            chart.x(function(d) {
	                    return d[0]
	                })
	                .y(function(d) {
	                    return d[1]
	                });
	    
	            chart.xAxis
	                .showMaxMin(false)
	                .tickFormat(function(d) {
	                    return d3.time.format('%x')(new Date(d))
	                });
	    
	            chart.x2Axis
	                .showMaxMin(false)
	                .tickFormat(function(d) {
	                    return d3.time.format('%x')(new Date(d))
	                });
	    
	            chart.yAxis
	                .tickFormat(d3.format(',.2f'));
	    
	            chart.y2Axis
	                .tickFormat(d3.format(',.2f'));
	    
	    
	            return this.loadGraph(data, chart);
	        
	        }.bind(this));
	    
	    },
	    loadGraph:function(data,chart) {
	     d3.select('#chart svg')
	          .datum(data)
	        .transition().duration(500)
	          .call(chart);
	      nv.utils.windowResize(chart.update);
	      return chart;
	    },
	    componentDidMount:function(){
	          this.loadChart();
	    },
	    loadChart:function(){
	        this.props.tickers.forEach(function(ticker) {
	          
	            this.gatherData(this.apiUrl(ticker), function() {
	                if (this.totalJSON.length == this.props.tickers.length) {
	                    this.chartStocks(this.totalJSON);
	                }
	            }.bind(this));
	        }.bind(this));  
	    },
	    componentDidUpdate:function(prevProps,  prevState){
	          this.totalJSON= [];
	          this.loadChart();
	    },
	    render: function() {
	        return (
	        	React.createElement("div", {id: "chart"}, 
	        	React.createElement("svg", null
	        	)
	        	)
	        )
	    }
	});



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM *//** @jsx React.DOM */
	'use strict'
	var React = __webpack_require__(2);

	module.exports = React.createClass({displayName: "module.exports",
	    getInitialState:function(){
	      return({
	        ticker:''
	      });
	    },
	    handleOnClick:function(e){
	        e.preventDefault();
	        this.props.onTickerAdd(this.state.ticker);
	    },
	    
	    handleOnChange:function(e){
	      this.setState({
	        ticker:e.target.value
	      });
	    },
	    render: function() {
	        return (
	        	 React.createElement("form", {className: "form-inline"}, 
	          React.createElement("div", {className: "form-group"}, 
	            React.createElement("label", {htmlFor: "exampleInputName2"}, "Stock Symbol"), 
	            React.createElement("input", {type: "text", className: "form-control", id: "exampleInputName2", placeholder: "APPL, GOOG", value: this.state.ticker, onChange: this.handleOnChange})
	          ), 
	          
	          React.createElement("button", {type: "submit", className: "btn btn-default", onClick: this.handleOnClick}, "Add Stock")
	        )
	        )
	    }
	});



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM *//** @jsx React.DOM */
	'use strict'
	var React = __webpack_require__(2);

	module.exports = React.createClass({displayName: "module.exports",
	    handleOnClick:function(e){
	        this.props.onDeleteTicker(e.target.id);
	    },
	    render: function() {
	        return (
	        React.createElement("div", {className: "row"}, 
	            this.props.tickers.map(function(ticker, index){
	                return(
	            	React.createElement("div", {key: ticker, className: "col-md-2"}, 
	            		React.createElement("div", {className: "well"}, 
	            		React.createElement("span", {id: index, className: "glyphicon glyphicon-remove", "aria-hidden": "true", onClick: this.handleOnClick}), ticker
	            		)
	            	)
	            	);
	            }.bind(this)
	            )
	        	
	        )
	        )
	    }
	});



/***/ }
/******/ ]);