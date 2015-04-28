var React = require("react");
var getJSON = require("./getJSON.jsx");
var { auth, AuthMixin } = require("./auth.jsx");
var APIServer = "/api";
var Labels = require("./labels.jsx");

var IssueCard = React.createClass({
  render: function() {
    var data = this.props.data;
    return (
      <li>
          <a href={data.html_url} target="_blank">
              <h4>{data.title} <br/><small>{data.repository.name}</small></h4>
              <Labels labels={data.labels} minimal='true' />
          </a>
      </li>
      );
  }
});

var ShowMyIssues = React.createClass({
  getInitialState: function() {
    return {
      issuegroups: []
    };
  },
  componentDidMount: function() {
    var self = this;
    // Assigned issues
    getJSON(APIServer + "/myissues/assigned",
      function(data) {
        if (self.isMounted()) {
          var issues = { title: 'Assigned',
                        issues: data.issues}
          var newState = self.state.issuegroups;
          newState.push(issues)
          self.setState(newState);
        }
      },
      function(err) {
      }
    );
    // subscribed issues
    getJSON(APIServer + "/myissues/subscribed",
      function(data) {
        if (self.isMounted()) {
          var issues = { title: 'Subscribed',
                        issues: data.issues}
          var newState = self.state.issuegroups;
          newState.push(issues)
          self.setState(newState);
        }
      },
      function(err) {
      }
    );
    // mentions issues
    getJSON(APIServer + "/myissues/mentioned",
      function(data) {
        if (self.isMounted()) {
          var issues = { title: 'Mentioned',
                        issues: data.issues}
          var newState = self.state.issuegroups;
          newState.push(issues)
          self.setState(newState);
        }
      },
      function(err) {
      }
    );
    // created issues
    getJSON(APIServer + "/myissues/created",
      function(data) {
        if (self.isMounted()) {
          var issues = { title: 'Created',
                        issues: data.issues}
          var newState = self.state.issuegroups;
          newState.push(issues)
          self.setState(newState);
        }
      },
      function(err) {
      }
    );
  },
  render: function() {
    var issuegroups = this.state.issuegroups.map( function(issuegroup) {
      var issueCards = issuegroup.issues.map( function(issue) {
        return <IssueCard key={issue.id} data={issue}/>;
      });
      return (<div key={issuegroup.title}>
        <h2 className="clearfix">{issuegroup.title}</h2>
        <ul className="issues">
          {issueCards}
        </ul>
        </div>
      );
    });

    return (
      <div>
        <div className="header">
          <h2>All My Issues</h2>
        </div>
        <div className="main">
            <div className="myissues">
              {issuegroups}
            </div>
            <p>If you have more than 100 assigned issues: <a href="https://github.com/issues/assigned">visit Github directly</a>, and learn to delegate. </p>
        </div>
      </div>
    );
  }
});


var MyIssues = React.createClass({
  mixins: [AuthMixin],
  render: function() {
    if (this.state.loggedIn) {
      return <ShowMyIssues/>;
    } else {
      return (
        <div>
          <div className="header">
            <h2>All My Issues</h2>
          </div>
          <div className="main">
            <a className="button" onClick={this.login}>Login with Github</a>
            <p>Log in to your Github account to see a list of all your open GitHub issues:</p>
            <ul>
              <li>Assigned</li>
              <li>Subscribed</li>
              <li>Mentioned</li>
              <li>Created</li>
            </ul>
            <div className="pagefill"/>
          </div>
        </div>
        );
    }
  }
});

module.exports = MyIssues;
