var React = require("react");

var Design = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h2>Design</h2>
        </div>
        <div className="design-intro">
          <header>
            <h2>Welcome to the Design Hub of the Mozilla Foundation.</h2>
          </header>
        </div>
        <div className="main-fluid design">
          <h3 className="description">Whether you’re looking to learn more about how Mozilla Foundation designers work or quickly trying to find a logo, we’ve got everything you need in this central place. If you can’t find what you’re looking for, <a href="#">let us know</a>.</h3>
          <div id="assets">
            <h2>Resources</h2>
            <div className="grid-4">
              <h4>Principles</h4>
              <p>The principles we care about building into our products, our process and our team.
              </p>
              <a href="#" className="button">Design Principles</a>
            </div>
            <div className="grid-4">
              <h4>Templates & Guidelines</h4>
              <p>Standards and kits for incoporating new work into existing projects, including documentation for Webmaker, Mozilla Learning Networks and Mozilla Advocacy.
              </p>
              <a href="#" className="button">Templates & Guides</a>
            </div>
            <div className="grid-4">
              <h4>Assets</h4>
              <p>Logos, fonts, colours, UX & UI templates for mobile, tablet and desktop, photography, illustration, etc.
              </p>
              <a href="#" className="button">Assets Folder</a>
            </div>
            <div className="grid-4">
              <h4>Process</h4>
              <p>More about how we work, including how we relish working with design contributors.
              </p>
              <a href="#" className="button">Tools & Process</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Design;