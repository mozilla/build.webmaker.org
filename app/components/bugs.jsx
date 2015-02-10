var React = require("react");

var Design = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h2>Bugs</h2>
        </div>
        <div className="main bugs">
          <div id="assets">
            <h2 className="clearfix">Do you have a bug or feature you want to file?</h2>
            <p>For bugs or feature requests regarding this site, use the <a href="https://github.com/mozilla/build.webmaker.org/issues/"> build.webmaker.org</a> github issues list.</p>
            <p>For the mobile Webmaker app (Android or FirefoxOS), use the <a href="https://github.com/mozilla/webmaker-app/issues/">webmaker-app</a> list.</p>
            <p>For the Webmaker site (webmaker.org), use the <a href="https://github.com/mozilla/webmaker.org/issues/">webmaker-app</a> list.</p>
            <p>(more links coming)</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Design;