/** @jsx React.DOM */
'use strict'
var React = require("react");

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
    render: function() {
        return (
        	 <form className="form-inline">
          <div className="form-group">
            <label htmlFor="exampleInputName2">Stock Symbol</label>
            <input type="text" className="form-control" id="exampleInputName2" placeholder="APPL, GOOG" value = {this.state.ticker} onChange={this.handleOnChange}/>
          </div>
          
          <button type="submit" className="btn btn-default" onClick={this.handleOnClick}>Add Stock</button>
        </form>
        )
    }
});

