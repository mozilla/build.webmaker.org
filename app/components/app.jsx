var React = require("react");
var Router = require("react-router");
var { Route, RouteHandler, Link, DefaultRoute } = Router;
var { AuthBlock, AuthMixin, auth } = require("./auth.jsx");
var getJSON = require("./getJSON.jsx");
var MentionsApp = require("./mentions.jsx");

// XXX get it from a config file in the Gulp file?
// var APIServer = "http://1c75f1df.ngrok.com";
var APIServer = "";
var App = React.createClass({
    getInitialState: function() {
      return {
        loggedIn: false
      };
    },

    render: function() {
      return (
        <div>
          <ul className="navigation">
            <li className="icon-home"><Link to="/">Home</Link></li>
            <AuthBlock/>
            <li>&nbsp;</li>

            <li className="icon-add"><Link to="add">Add Project</Link></li>
            <li className="icon-now"><Link to="now">This Heartbeat</Link></li>
            <li className="icon-next">
              <Link to="next">Next Heartbeat</Link>
            </li>
            <li className="icon-upcoming">
              <Link to="upcoming">Upcoming</Link>
            </li>
            <li>&nbsp;</li>
            <li className="icon-strategy">
            <a href="https://wiki.mozilla.org/Webmaker/2015">Strategy</a></li>
            <li className="icon-dashboard">
<a href="https://mozillafoundation.geckoboard.com/dashboards/F62088172D822E2A">
            Dashboard</a></li>
            <li>&nbsp;</li>
            <li className="icon-how">How We Work</li>
            <ul>
              <li><a href="https://book.webmaker.org">Process</a></li>
              <li><Link to="design">Design Assets</Link></li>
            </ul>

            <li className="icon-involved">
            <a href="/involved">Get Involved</a></li>
          </ul>
          <input type="checkbox" id="nav-trigger" className="nav-trigger" />
          <label htmlFor="nav-trigger"></label>
          <div className="container">
            <RouteHandler/>
          </div>
        </div>
      );
    },

    onLoggedIn: function(data) {
      this.setState({
        loggedIn: true
      });
    },

    onLoggedOut: function() {
      this.setState({
        loggedIn: false
      });
    }
});

var Add = React.createClass({
  mixins: [AuthMixin],
  render: function() {
    var body = (
      <div>
        <a className="button" onClick={this.login}>Login with Github</a>
        <p>To create new projects you need to be logged-in to your Github account.</p>
        <div className="pagefill"/>
      </div>
    );
    if (this.state.loggedIn) {
      body = (
        <div id="add">
          <form method="POST">
            <div className="question">
              <h2>Give your project a title.</h2>
              <p>In as few words as possible, describe what this project is about.</p>
              <textarea name="title" rows="2"></textarea>
            </div>

            <div className="question">
              <h2>What is the problem you are trying to solve?</h2>
              <p>Describe what’s broken or missing from the current experience.</p>
              <textarea name="problem" rows="8"></textarea>
            </div>

            <div className="question">
              <h2>Who are the users you are trying to impact?</h2>
              <p>Describe who is being affected by the problem you have described (visitors, teachers, staff, community).</p>
              <textarea name="audience" rows="8"></textarea>
            </div>

            <div className="question">
              <h2>What does success look like?</h2>
              <p>Describe the "state change" that you wish to accomplish. Do you have metrics that we can reference?</p>
              <textarea name="success" rows="8"></textarea>
            </div>

            <div className="question">
              <h2>What is your vision for a solution?</h2>
              <p>Describe a high level solution to solve the problem. Think about the most important, impactful part of the solution.</p>
              <textarea name="vision" rows="8"></textarea>
            </div>

            <div className="question">
              <h2>How will you measure success?</h2>
              <p>Describe the data you will use. Is there existing tracking in place? Do you need to setup new reports or dashboards?</p>
              <textarea name="measurement" rows="8"></textarea>
            </div>
            <button className="button" type="submit">Submit Project</button>
          </form>
        </div>
      )
    };
    return (
      <div>
        <div className="header">
          <h2>New Initiative</h2>
        </div>
        <div className="main">
          {body}
        </div>
      </div>
    );
  }
});

var Labels = React.createClass({
  render: function() {
    var labels = this.props.labels.map( function(label) {
      var style = { backgroundColor: String(label.color),
                   color: (parseInt(label.color, 16) > 0xffffff / 2) ?
                   "0a3931" : "white"
      };
      return <li key={label.name} style={style}>{label.name}</li>;
    });
    return (
      <ul className="labels">
      {labels}
      </ul>
    );
  }
});

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


var Dashboard = React.createClass({
  mixins: [AuthMixin],
  getInitialState: function() {
    var handle = auth.getCurrentUser();
    if (!handle) return {};
    return {
      handle: handle
    };
  },
  render: function() {
    return (
      <div id="dashboard">
        <div className="header">
          <h2>Dashboard for {this.state.details.name}</h2>
        </div>
        <div className="main">
          <MentionsApp handle={this.state.handle}/>
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
              <p>The Mozilla Foundation is a non-profit organization
              that promotes openness, innovation and participation on
              the Internet. We promote the values of an open Internet
              to the broader world.</p>
              <p>Mozilla is best known for the Firefox browser, but we
              advance our mission through other software projects, grants
              and engagement and education efforts such as Mozilla Webmaker.</p>
              <p>Webmaker is all about building a new generation of
              digital creators and webmakers, giving people the tools
              and skills they need to move from using the web to actively
              making the web.</p>
              <p>If you're interested in supporting our efforts, please
              consider getting involved with Mozilla Webmaker, making
              a donation or getting involved with the
              Mozilla community.</p>
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

var Design = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h2>Design Assets</h2>
        </div>
        <div className="main">
            <div id="assets">
                <h2 className="clearfix">Design Assets</h2>
                <p>These live on <a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE">Google Drive</a> for now.  Each link below will take you to the relevant subdirectory.</p>

                <ul className="assets">
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0ByGu6IwBft5mNHFHVWNGSmNoNkU">Bootstrap</a> houses Illustrator files to design using Bootstrap 3 grids</li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkbjJDeVYxMmhUVTQ">Templates</a> is where we keep starter Sketch files for Webmaker pages</li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkekZVdTJ0VjcxUzg">Process</a> has assets we use in redpen to indicate process state</li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkNXpOTzdpZ3NkUU0">Patterns</a> tileable patterns</li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkZjRsMDJMa3h0WUE">Logos</a></li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkVmNRWnNIT0JfcHc">Icons</a></li>
                  <li><a href="https://drive.google.com/drive/u/0/#folders/0B_rbDAen9prkS0N4MXRqaGo4bEE/0B_rbDAen9prkUmd1N1lFM3E0dFk">Colors</a></li>
                </ul>
            </div>
        </div>
      </div>
    );
  }
});


var routes = (
  <Route path="/" handler={App}>
    <Route name="add" handler={Add}/>
    <Route name="now" handler={Now}/>
    <Route name="next" handler={Next} path="next" title="Next Heartbeat"/>
    <Route name="upcoming" handler={Upcoming}/>
    <Route name="design" handler={Design}/>
    <DefaultRoute handler={Homepage}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById("app"));
});

