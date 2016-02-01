var companies = ["AAPL", "MSFT",'AMZN','GOOG','CSCO','C','HD'];
//var companies = ["AAPL","MSFT"];

var apiUrl = function(ticker){
    return 'https://www.quandl.com/api/v3/datasets/WIKI/'+ticker+'.json?auth_token=QfNWrHRUVDFsc4VnixRr&collapse=monthly&start_date=2000-01-01&end_date=2016-01-15'
}
    
var chartStocks = function(data){

   
   
   nv.addGraph(function() {
  var chart = nv.models.lineWithFocusChart();
      chart.x(function(d) { return d[0] })
    .y(function(d) { return d[1]})
    ;
    
      chart.xAxis
    .tickFormat(function(d) {
      return d3.time.format('%x')(new Date(d))
    });
    
    chart.x2Axis
    .tickFormat(function(d) {
      return d3.time.format('%x')(new Date(d))
    });

  chart.yAxis
      .tickFormat(d3.format(',.2f'));

  chart.y2Axis
      .tickFormat(d3.format(',.2f'));
      
      

  d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
   
};

var totalJSON = [];
var gatherData = function(url, done){
    d3.json(url, function(data) {
        
        data = type(data);
        totalJSON.push(data);
        done();
    });
};

companies.forEach(function(ticker){
    gatherData(apiUrl(ticker), function(){
        if(totalJSON.length == companies.length ){
            chartStocks(totalJSON);
        }
    });
});


var type = function(data) {
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
}

