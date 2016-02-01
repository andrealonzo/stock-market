/** @jsx React.DOM */
'use strict'
var React = require("react");

module.exports = React.createClass({
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
        	<div id="chart">
        	<svg>
        	</svg>
        	</div>
        )
    }
});

