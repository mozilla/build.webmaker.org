var React = require("react");
var getJSON = require("./getJSON.jsx");
var APIServer = "/api";
var Labels = require("./labels.jsx");

var IssueCard = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var data = this.props.data;
    return (
      <li>
          <a href="{data.html_url}" target="_blank">
              <h4>{data.title}</h4>
              <Labels labels={data.labels}/>
          </a>
      </li>
      );
  }
});

var Upcoming = React.createClass({
  getInitialState: function() {
    return {
      milestones: []
    };
  },
  componentDidMount: function() {
    var self = this;
    getJSON(APIServer + "/upcoming",
      function(data) {
        if (self.isMounted()) {
          self.setState({ milestones:data.milestones });
        }
      },
      function(err) {
      }
    );
  },
  render: function() {
    var milestones = this.state.milestones.map( function(milestone) {
      var issueCards = milestone.issues.map( function(issue) {
        return <IssueCard key={issue.id} data={issue}/>;
      });
      return (<div key={milestone.id}>
        <h2 className="clearfix">{milestone.title}</h2>
        <ul className="issues">
          {issueCards}
        </ul>
        </div>
      );
    });

    return (
      <div>
        <div className="header">
          <h2>Upcoming</h2>
        </div>
        <div className="main">
            <div id="calendar">
              {milestones}
            </div>
        </div>
      </div>
    );
  }
});

module.exports = Upcoming;