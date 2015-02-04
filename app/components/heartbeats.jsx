var React = require("react");
var getJSON = require("./getJSON.jsx");
var Labels = require("./labels.jsx");
var APIServer = "/api";

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
      p1: [],
      p2: []
    };
  },
  componentDidMount: function() {
    var self = this;
    getJSON(APIServer + "/" + self.props.path,
      function(data) {
        if (self.isMounted()) {
          self.setState({ p1:data.issues.p1, p2:data.issues.p2 });
        }
      },
      function(err) {
      }
    );
  },

  render: function() {
    return (
      <div>
        <div className="header">
          <h2>{this.props.title}</h2>
        </div>
        <div className="main">
          <div id="sprint">
            <h2>Top Priorities</h2>
            <IssuesList issues={this.state.p1}/>
            <h2>Other Priorities</h2>
            <IssuesList issues={this.state.p2}/>
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
