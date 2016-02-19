var React = require("react");
var Router = require("react-router");
var ga = require("react-ga");
var { Route, RouteHandler, Link, DefaultRoute } = Router;
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
            <li className="icon-home">
              <Link to="/">
                Home
              </Link>
            </li>
            <li>&nbsp;</li>

            <li className="icon-strategy">
              Strategy
            </li>
            <ul className="sublist">
              <li>
                <a href="http://mzl.la/2020">
                  Overview
                </a>
              </li>
              <li>
                <a href="https://docs.google.com/document/d/1OipsGu8eWuTaT8J3T2-0CR3zB79SysATBLiTTBDGS5I/preview#heading=h.lb5icvvsqptv">
                  Leadership
                </a>
              </li>
              <li>
                <a href="https://docs.google.com/document/d/1OipsGu8eWuTaT8J3T2-0CR3zB79SysATBLiTTBDGS5I/preview#heading=h.x2ri9k3nwuu9">
                  Advocacy
                </a>
              </li>
            </ul>

            <li className="icon-next">
              Goals
            </li>
            <ul className="sublist">
              <li>
                <a href="https://github.com/MozillaFoundation/Goals/issues?q=is%3Aopen+label%3A%22Leadership+Network%22+label%3A%22H1+2016%22">
                  Leadership
                </a>
              </li>
              <li>
                <a href="https://github.com/MozillaFoundation/Goals/issues?utf8=%E2%9C%93&q=is%3Aopen+label%3A%22Advocacy+Engine%22+label%3A%22H1+2016%22+">
                  Advocacy
                </a>
              </li>
            </ul>

            <li className="icon-now">
              Plan
            </li>
            <ul className="sublist">
              <li>
                <Link to="/now">
                  Heartbeat
                </Link>
              </li>
              <li>
                <a href="https://docs.google.com/spreadsheets/d/1fr76MH_PJUJXAKvshj8kqTGInA2Sy6l4NoE9Bnxnmvc/preview#gid=517975171">
                  Month
                </a>
              </li>
              <li>
                <a href="https://github.com/MozillaFoundation/Goals/issues">
                  Quarter
                </a>
              </li>
            </ul>

            <li className="icon-audience">
              Resources
            </li>
            <ul className="sublist">
              <li>
                <a href="https://docs.google.com/document/d/1snKZJcfau9irLs_aK0lYVT-NnAt5er-byuuHPkUcRVo/preview">
                  Onboarding Handbook
                </a>
              </li>
              <li>
                <a href="http://book.webmaker.org/process.html">
                  Process / Project Management
                </a>
              </li>
              <li>
                <a href="https://mana.mozilla.org/wiki/display/FOUNDATION/Program+Review">
                  Quarterly Reviews
                </a>
              </li>
              <li>
                2016 Calendar (coming soon)
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

// FIXME: Make this part of env instead of hardcoded value.
ga.initialize('UA-35433268-62');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  if (state.pathname === "/design") {
    ga.pageview(state.pathname);
  }
  React.render(<Handler/>, document.getElementById("app"));
});
