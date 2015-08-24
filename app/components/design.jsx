var React = require("react");

var Design = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h2>Design</h2>
        </div>
        <div className="design-intro">
          <header className="wrap">
            <h2>Welcome to the Design Hub of the Mozilla Foundation.</h2>
          </header>
          <section>
            <article><img src="img/designteam/cassie.svg"alt="Cassie McDaniel"/></article>
            <article><img src="img/designteam/jordan.svg"alt="Jordan Gushwa"/></article>
            <article><img src="img/designteam/luke.svg"alt="Luke Pacholski"/></article>
            <article><img src="img/designteam/matthew.svg"alt="Matthew Willse"/></article>
            <article><img src="img/designteam/ricardo.svg"alt="Ricardo Vazquez"/></article>
            <article><img src="img/designteam/sabrina.svg"alt="Sabrina Ng"/></article>
          </section>
        </div>
        <div className="main-fluid design">
          <h3 className="description">Whether you’re looking to learn more about how Mozilla Foundation designers work or quickly trying to find a logo, we’ve got everything you need in this central place. If you can’t find what you’re looking for, <a href="mailto:mofodesign@mozilla.org">let us know</a>.</h3>
          <div id="assets">
            <h2>Resources</h2>
            <div className="grid-4">
              <h4>Principles</h4>
              <p>The <a href="https://github.com/MozillaFoundation/Design/issues/39" target="_" className="link">principles</a> we care about building into our products, our process and our team.
              </p>
              <a href="https://github.com/MozillaFoundation/Design/issues/39" target="_" className="button">Design Principles</a>
            </div>
            <div className="grid-4">
              <h4>Templates & Guidelines</h4>
              <p>Standards and kits for incoporating new work into existing projects, including documentation for <a href="https://drive.google.com/open?id=0ByIoeeW0a3R_MHljbUVhVEM0N1E" target="_" className="link">Webmaker</a>, <a href=" https://drive.google.com/a/mozilla.com/folderview?id=0B4Q8pzCpDS_eR2dpNnJXRTR1UVU&usp=sharing" target="_"className="link">Mozilla Learning Networks</a> and Mozilla Advocacy.
              </p>
              <a href="https://drive.google.com/open?id=0ByIoeeW0a3R_UjEzdDU4NlMzYXc" target="_" className="button">Templates & Guides</a>
            </div>
            <div className="grid-4">
              <h4>Assets</h4>
              <p><a href="https://drive.google.com/open?id=0B_rbDAen9prkZjRsMDJMa3h0WUE" target="_" className="link">Logos</a>, <a href="https://drive.google.com/open?id=0B_rbDAen9prkYkFhOTNBX2RpYUU" target="_" className="link">fonts</a>, <a href="https://drive.google.com/open?id=0B_rbDAen9prkUmd1N1lFM3E0dFk" target="_" className="link">colours</a>, <a href="https://www.flickr.com/photos/mozilladrumbeat/favorites/" target="_" className="link">photography</a>, <a href="https://drive.google.com/open?id=0BzfN9sXlOXt1RmE5dlhpQ2JCVXc" target="_" className="link">illustration</a>, etc.
              </p>
              <a href="https://drive.google.com/open?id=0ByIoeeW0a3R_STBRYnYzTTJvVkk" target="_" className="button">Assets Folder</a>
            </div>
            <div className="grid-4">
              <h4>Process</h4>
              <p>More about how we work</a>, including how we relish working with <a href="https://github.com/MozillaFoundation/Design/issues/50" target="_" className="link">design contributors</a>.
              </p>
              <a href="https://github.com/MozillaFoundation/Design/wiki/Process" target="_" className="button">Tools & Process</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Design;
