var React = require("react");
var getJSON = require("./getJSON.jsx");
var Mentions = require("./mentions.jsx");
var { auth, AuthMixin } = require("./auth.jsx");
var { Link } = require("react-router");
var pluralize = require("pluralize");

var GithubSearch = {
  getInitialState: function() {
    return {items: [], total_count: 0};
  },
  componentDidMount: function() {
    var fragment = this.makeFragment();
    var self = this;
    getJSON("/api/github/search/issues" + fragment,
      function(data) {
        if (self.isMounted()) {
          self.setState(data);
        }
      },
      function(err) {
      }
    );
  },
};

var GithubIssuesSearch = React.createClass({
  mixins: [GithubSearch],
  makeFragment: function() {
    return "?q=" + encodeURIComponent("assignee:" + this.props.handle + " state:open");
  },
  render: function() {
    var planPrefix = "https://api.github.com/repos/MozillaFoundation/plan/issues";
    var issues = this.state.items.filter(function(item) {
      // filter out the plan issues, called 'initiatives'
      return (item.url.indexOf(planPrefix) !== 0);
    });
    issues = issues.map(function(item) {
      return <li key={item.html_url}><a href={item.html_url}>{item.title}</a></li>;
    });
    if (issues.length) {
      var noun = pluralize("issue", issues.length);
      return (
        <div id="openissues">
          <h2>{issues.length} open {noun} assigned</h2>
          <ul>
            {issues}
          </ul>
        </div>
      );
    } else {
      return (
        <div id="openissues">
          <h2>No open issues assigned, nice!</h2>
        </div>
      );
    }
  }
});


var GithubPRSearch = React.createClass({
  mixins: [GithubSearch],
  makeFragment: function() {
    return "?q=" + encodeURIComponent("assignee:" + this.props.handle) +
      "+state:open+type:pr";
  },
  render: function() {
    var issues = this.state.items.map(function(item) {
      return <li key={item.html_url}><a href={item.html_url}>{item.title}</a></li>;
    });
    if (issues.length) {
      var noun = pluralize("request", issues.length);
      return (
        <div id="openprs">
          <h2>{issues.length} open pull {noun}</h2>
          <ul>
            {issues}
          </ul>
        </div>
      );
    } else {
      return (
        <div id="openprs">
          <h2>No open pull requests, nice!</h2>
        </div>
      );
    }
  }
});
var GithubInitiativesSearch = React.createClass({
  mixins: [GithubSearch],
  makeFragment: function() {
    return "?q=" + encodeURIComponent("assignee:" + this.props.handle) +
      "+state:open+org:MozillaFoundation+repo:plan";
  },
  render: function() {
    var issues = this.state.items.map(function(item) {
      return <li key={item.html_url}><a href={item.html_url}>{item.title}</a></li>;
    });
    if (issues.length) {
      var noun = pluralize("initiative", issues.length);
      return (
        <div id="openinitiatives">
          <h2>{issues.length} open {noun} assigned</h2>
          <ul>
            {issues}
          </ul>
        </div>
      );
    } else {
      return (
        <div id="openinitiatives">
          <h2>No open initiatives assigned.</h2>
        </div>
      );
    }
  }
});



var Dashboard = React.createClass({
  mixins: [AuthMixin],
  getInitialState: function() {
    var handle = auth.getCurrentUser();
    if (!handle) {
      return {};
    }
    return {
      handle: handle
    };
  },
  render: function() {
    var handle = this.state.handle;
    return (
      <div id="dashboard">
        <div className="header">
          <h2>Dashboard for {this.state.details.name}</h2>
        </div>
        <div className="main">
          <GithubInitiativesSearch handle={handle}/>
          <GithubPRSearch handle={handle}/>
          <GithubIssuesSearch handle={handle}/>
          <Mentions handle={handle}/>
        </div>
      </div>
    );
  }
});

var Splash = React.createClass({
  render: function() {
    return (
      <div id="splash">
        <div className="masthead">
          <div className="wrap">
            <h1>Let's Build Webmaker Together</h1>

            <div className="center">
              <Link className="button btn-white"
                    to="add">Add Project</Link>
              <Link className="button btn-white"
                    to="now">This Heartbeat</Link>
            </div>
          </div>
        </div>

        <div className="copy">
          <div className="wrap">
            <div className="center">
              <h4>Our Mission</h4>
            </div>
            <div className="columns">
              <p>The Mozilla Foundation is a non-profit organization that promotes openness, innovation and participation on the Internet. We promote the values of an open Internet to the broader world.</p>
              <p>Mozilla is best known for the Firefox browser, but we advance our mission through other software projects, grants and engagement and education efforts such as Mozilla Webmaker.</p>
              <p>Webmaker is all about building a new generation of digital creators and webmakers, giving people the tools and skills they need to move from using the web to actively making the web.</p>
              <p>If you&rsquo;re interested in supporting our efforts, please consider getting involved with Mozilla Webmaker, making a donation or getting involved with the Mozilla community.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


var Homepage = React.createClass({
  mixins: [AuthMixin],
  render: function() {
    if (this.state.loggedIn) {
      return <Dashboard/>;
    } else {
      return <Splash/>;
    }
  }
});

module.exports = Homepage;
