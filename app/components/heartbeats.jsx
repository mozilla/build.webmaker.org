var React = require("react");
var getJSON = require("./getJSON.jsx");
var Labels = require("./labels.jsx");
var APIServer = "/api";
var Filter = require("./filter.jsx");

var Issue = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    var data = this.props.data;
    if (!data) {
      return <div/>;
    }
    var lines = data.body.split("\n");
    var trimmedBody = lines[0];
    var Img = data.assignee ?
      <img src={data.assignee.avatar_url}
           title="Assigned to"
           alt={data.assignee.login}/> :
      <img src={data.user.avatar_url}
           title="Created by"
           alt={data.user.login}/>;
    return (
      <li className="clearfix">
          <a href={data.html_url} target="_blank">
            {Img}
            <h3>{data.title}</h3>
            <p>{trimmedBody}</p>
          </a>
          <Labels labels={data.labels}/>
      </li>
    );
  }
});

var IssuesList = React.createClass({
  getInitialState: function() {
    return { "issues": [] };
  },
  render: function() {
    var issues = this.props.issues.map( function(issue) {
      return <Issue key={issue.id} data={issue}/>;
    });
    return (
      <ul className="issues">
        {issues}
      </ul>
    );
  }
});

var Heartbeat = React.createClass({
  getInitialState: function() {
    return {
      full: {
        p1: [],
        p2: []
      },
      filtered: {
        p1: [],
        p2: []
      }
    };
  },
  componentDidMount: function() {
    var self = this;
    getJSON(APIServer + "/" + self.props.path,
      function(data) {
        if (self.isMounted()) {
          self.setState({ full: {p1:data.issues.p1, p2:data.issues.p2 },
                          filtered: {p1:data.issues.p1, p2:data.issues.p2 }
                        });
        }
      },
      function(err) {
      }
    );
  },
  doFilter: function(filterText) {
    var matchingP1s=[];
    var matchingP2s=[];
    if (filterText == "") {
      this.setState({
          filtered: {
            p1: this.state.full.p1,
            p2: this.state.full.p2
          }
      });
    }
    this.state.full.p1.forEach(function(issue){
      console.log("ISSUE", issue);
      // Filtering on title, labels, and body
      var labels = issue.labels.map(function(label) { return label.name}).join(",");
      if ((issue.title.toLowerCase().indexOf(filterText)!=-1) ||
          (issue.body.toLowerCase().indexOf(filterText)!=-1) || 
          (labels.toLowerCase().indexOf(filterText)!=-1)) {
        matchingP1s.push(issue);
      }
    });
    this.state.full.p2.forEach(function(issue){
      // Filtering on title, labels, and body
      var labels = issue.labels.map(function(label) { return label.name}).join(",");
      if ((issue.title.toLowerCase().indexOf(filterText)!=-1) ||
          (issue.body.toLowerCase().indexOf(filterText)!=-1) || 
          (labels.toLowerCase().indexOf(filterText)!=-1)) {
        matchingP2s.push(issue);
      }
    });

    this.setState({
        filtered: {
          p1: matchingP1s,
          p2: matchingP2s
        }
    });
  },

  render: function() {
    var p1s, p2s;
    if (this.state.filtered.p1.length) {
      p1s = (<div>
          <h2>Top Priorities</h2>
          <IssuesList issues={this.state.filtered.p1}/>
        </div>)
    } else {
      p1s = null;
    }
    if (this.state.filtered.p2.length) {
      p2s = (<div>
          <h2>Other Priorities</h2>
          <IssuesList issues={this.state.filtered.p2}/>
        </div>)
    } else {
      p2s = null;
    }
    return (
      <div>
        <div className="header">
          <h2>{this.props.title}</h2>
        </div>
        <Filter class="filter" fullset={this.state.query} doFilter={this.doFilter}/>
        <div className="main">
          <div id="sprint">
            {p1s}
            {p2s}
          </div>
        </div>
      </div>
    );
  }
});

var Now = React.createClass({
  render: function() {
    return <Heartbeat path="now" title="Current Heartbeat"/>;
  }
});
var Next = React.createClass({
  render: function() {
    return <Heartbeat path="next" title="Next Heartbeat"/>;
  }
});

module.exports.Now = Now;
module.exports.Next = Next;
