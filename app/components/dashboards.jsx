var React = require("react");

var Dashboards = React.createClass({
  render: function() {
    return (
      <div className="fullPageWrapper">
        <div className="header">
          <h2>Dashboards</h2>
        </div>
        <iframe className="fullPage" src="https://metrics.webmaker.org/dashboards">
        </iframe>
      </div>
    );
  }
});

module.exports = Dashboards;
