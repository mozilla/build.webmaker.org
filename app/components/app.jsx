var React = require("react");
var Router = require("react-router");
var { Route, RouteHandler, Link, DefaultRoute } = Router;
var { AuthBlock } = require("./auth.jsx");
var Add = require("./add.jsx");
var Issues = require("./issues.jsx");
var { Now, Next } = require("./heartbeats.jsx");
var Upcoming = require("./upcoming.jsx");
var MyIssues = require("./myissues.jsx");
var Homepage = require("./homepage.jsx");
var Design = require("./design.jsx");
var Dashboards = require("./dashboards.jsx");
var Bugs = require("./bugs.jsx");
var Audience = require("./audience.jsx");

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
            <li className="icon-github"><Link to="myissues">All My Issues</Link></li>
            <li>&nbsp;</li>

            <li className="icon-add"><Link to="add">Add Project</Link></li>
            <li className="icon-github"><Link to="issues">Issues</Link></li>
            <li className="icon-now"><Link to="now">This Heartbeat</Link></li>
            <li className="icon-next">
              <Link to="next">Next Heartbeat</Link>
            </li>
            <li className="icon-upcoming">
              <Link to="upcoming">Upcoming</Link>
            </li>
            <li>&nbsp;</li>
            <li className="icon-audience"><Link to="audience">Our Audience</Link></li>
            <li className="icon-strategy">
            <a href="https://wiki.mozilla.org/Webmaker/2015">Strategy</a></li>
            <li className="icon-dashboard"><Link to="dashboards">Dashboards</Link></li>
            <li>&nbsp;</li>
            <li className="icon-how">How We Work</li>
            <ul className="sublist">
              <li><a href="http://book.webmaker.org">Process</a></li>
              <li><Link to="design">Design</Link></li>
              <li className="icon-involved">
                <a href="https://webmaker.org/en-US/getinvolved">Get Involved</a>
              </li>
              <li className="file-a-bug icon-github">
                <Link to="bugs">File a bug</Link>
              </li>
            </ul>
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



var routes = (
  <Route path="/" handler={App}>
    <Route name="add" handler={Add}/>
    <Route name="issues" handler={Issues}/>
    <Route name="now" handler={Now}/>
    <Route name="next" handler={Next} path="next" title="Next Heartbeat"/>
    <Route name="upcoming" handler={Upcoming}/>
    <Route name="design" handler={Design}/>
    <Route name="bugs" handler={Bugs}/>
    <Route name="audience" handler={Audience}/>
    <Route name="dashboards" handler={Dashboards}/>
    <Route name="myissues" handler={MyIssues}/>
    <DefaultRoute handler={Homepage}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById("app"));
});

