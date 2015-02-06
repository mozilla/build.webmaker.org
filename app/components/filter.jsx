var React = require("react");

var Filter = React.createClass({
    doFilter:function(){
        var query=this.refs.filterInput.getDOMNode().value; // this is the search text
        this.props.doFilter(query.toLowerCase());
    },
    render:function(){
        return (<div className="filterdiv">
                  <input className="filter" type="text" ref="filterInput" placeholder="Filter" 
                      value={this.props.query} onChange={this.doFilter}/>
                  <i className="searchIcon fa fa-search"></i>
                </div>);
    }
});

module.exports = Filter;