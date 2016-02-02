/** @jsx React.DOM */
'use strict'
var React = require("react");
var $ = require("jquery");
//require('jquery-ui');
require('jquery-ui/autocomplete');
module.exports = React.createClass({
  
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
    componentDidMount:function(){
       $( "#ticker-field" ).autocomplete({
      
      source:function( request, response ) {

        //search text
         var api ="/api/stock/search/"+request.term;
         $.getJSON( api, function( data ){
          response(data.map(function(value){
            return value.ticker;
          }));        
         });
      },
      select: function(event, ui) {
        this.setState({
          ticker:ui.item.value
        });
      }.bind(this)
    });
    },
    render: function() {
        return (
        	 <form className="form-inline">
          <div className="form-group">
            <label htmlFor="exampleInputName2">Stock Symbol</label>
            <input type="text" className="form-control" id="ticker-field" placeholder="APPL, GOOG" value = {this.state.ticker} onChange={this.handleOnChange}/>
          </div>
          
          <button type="submit" className="btn btn-default" onClick={this.handleOnClick}>Add Stock</button>
        </form>
        )
    }
});

