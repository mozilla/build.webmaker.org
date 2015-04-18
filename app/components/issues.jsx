var React = require("react");

// This list of orgs hopefully can be the catalyst to fill in the other data arrays.
var orgs = "mozilla".split(" ");
var repos = [];
var users = [];
var labels = [];
var milestones = [];

function getJson(url, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    var data = {};
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        data = JSON.parse(httpRequest.responseText);
        callback(data);
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.send();
}

getJson("/github/users", function(data) {
  users = data;
});

getJson("/github/repo-names", function(data) {
  repos = data;
});

getJson("/github/labels", function(data) {
  labels = data;
});

getJson("/github/milestones", function(data) {
  milestones = data;
});


var Issues = React.createClass({
  getInitialState: function() {
    return {
      search: "assignee",
      term: "",
      query: []
    };
  },
  onSearchChange: function(e) {
    this.setState({
      search: e.target.value
    });
  },
  onTermChange: function(e) {
    this.setState({
      term: e.target.value
    });
  },
  onSubmit: function(e) {
    var query = this.state.query;
    query.push(this.state.search + ":" + this.state.term);
    this.setState({
      query: query
    });
  },
  render: function() {
    var query = this.state.query;
    var _this = this;
    var queryString = query.join("+");
    var link = "https://github.com/issues?utf8=✓&q=" + queryString;
    return (
      <div>
        <div className="header">
          <h2>Issues</h2>
        </div>
        <div className="main issues-page">
          <select onChange={this.onSearchChange} className="search-types">
            <option value="assignee" selected>Assignee</option> 
            <option value="author">Author</option>
            <option value="label">Label</option>
            <option value="milestone">Milestone</option>
            <option value="repo">Repo</option>
          </select>
          <input onInput={this.onTermChange} className="do-search-input" placeholder="search term" list={this.state.search}/>
          <datalist id="assignee">
            {users.map(function(item, index) {
              return (<option key={index} value={item}>{item}</option>);
            })}
          </datalist>
          <datalist id="author">
            {users.map(function(item, index) {
              return (<option key={index} value={item}>{item}</option>);
            })}
          </datalist>
          <datalist id="repo">
            {repos.map(function(item, index) {
              return (<option key={index} value={item}>{item}</option>);
            })}
          </datalist>
          <datalist id="milestone">
            {milestones.map(function(item, index) {
              return (<option key={index} value={item}>{item}</option>);
            })}
          </datalist>
          <datalist id="label">
            {labels.map(function(item, index) {
              return (<option key={index} value={item}>{item}</option>);
            })}
          </datalist>
          <button className="button" onClick={this.onSubmit}>add</button>
          <br/>
          {query.map(function(item, index) {
            return (<input key={index} onChange={function(e) {
              var value = e.target.value;
              var search = "";
              var term = "";
              var split = [];
              var thisQuery = _this.state.query;
              if (!value) {
                thisQuery.splice(index, 1);
              } else {
                split = value.split(":");
                search = split[0];
                term = split[1];
                thisQuery.splice(index, 1, search + ":" + term);
              }
              _this.setState({
                query: thisQuery
              });  
            }} type="text" value={item}/>);
          })}
          <br/>
          <a href={link} className="button">Take me there</a>
        </div>
      </div>
    );
  }
});

module.exports = Issues;
