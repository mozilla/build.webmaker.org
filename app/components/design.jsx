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
            <h4>Are you starting a new project? Would you like to collaborate with our team?</h4>
            <a className="button cta-white" href="http://bit.ly/mozdesignbrief" target="_">Visit our Design Brief</a>
          </header>
        </div>
        <div className="main-fluid design">
          <h3 className="description">Whether you’re looking to learn more about how Mozilla Foundation designers work or quickly trying to find a logo, we’ve got everything you need in this central place. If you can’t find what you’re looking for, <a href="mailto: mofo-design@mozillafoundation.org">let us know</a>.</h3>
          <div id="assets">
            <h2>Resources</h2>
            <div className="grid-4">
              <h4>Principles</h4>
              <p>The <a href="https://github.com/MozillaFoundation/Design/issues/39" target="_" className="link">principles</a> we care about building into our products, our process and our team. This work is ongoing – get involved!
              </p>
              <a href="https://github.com/MozillaFoundation/Design/issues/39" target="_" className="button">Design Principles</a>
            </div>
            <div className="grid-4">
              <h4>Templates</h4>
              <p>Standards and kits for incorporating new work into existing projects. Access our templates for <a href="https://drive.google.com/a/mozillafoundation.org/folderview?id=0B_rbDAen9prkfmJkOWo4ZzM4UlpBTFVqY3NsSmNEdWdmTUVQUHlQQmZIdEhwV2NpdmQ5dzQ&usp=drive_web&tid=0ByIoeeW0a3R_UjEzdDU4NlMzYXc" target="_" className="link">annotating designs</a>, creating <a href="https://drive.google.com/a/mozillafoundation.org/folderview?id=0B4Q8pzCpDS_efmdTWVlCOXF2b0c3NUJreElJYVphLUtGNHVWemo0aXQyRDB1UFRubXVFdTA&usp=drive_web&tid=0ByIoeeW0a3R_UjEzdDU4NlMzYXc#list" target="_" className="link">social share graphics</a>, or building upon the <a href="https://drive.google.com/a/mozillafoundation.org/folderview?id=0ByIoeeW0a3R_MUpOM1ExM3JMbmc&usp=drive_web&tid=0ByIoeeW0a3R_UjEzdDU4NlMzYXc#list" target="_" className="link">Webmaker UI</a>.</p>
              <a href="https://drive.google.com/open?id=0ByIoeeW0a3R_UjEzdDU4NlMzYXc" target="_" className="button">Templates</a>
            </div>
            <div className="grid-4">
              <h4>Assets</h4>
              <p><a href="https://drive.google.com/open?id=0B_rbDAen9prkZjRsMDJMa3h0WUE" target="_" className="link">Logos</a>, <a href="https://drive.google.com/open?id=0B_rbDAen9prkYkFhOTNBX2RpYUU" target="_" className="link">fonts</a>, <a href="https://drive.google.com/open?id=0B_rbDAen9prkUmd1N1lFM3E0dFk" target="_" className="link">colours</a> and <a href="https://www.flickr.com/photos/mozilladrumbeat/favorites/" target="_" className="link">photography</a>. Access working design files for all of <a href="https://drive.google.com/drive/u/1/folders/0BzfN9sXlOXt1OE01ekI2LVA4RGM" target="_" className="link">Mozilla Foundation's projects</a>.
              </p>
              <a href="https://drive.google.com/open?id=0ByIoeeW0a3R_STBRYnYzTTJvVkk" target="_" className="button">Assets Folder</a>
            </div>
            <div className="grid-4">
              <h4>Process</h4>
              <p>Learn more about how we work. Use our <a href="https://docs.google.com/document/d/1H4rDTT7zdvOFhGlgMDIuRLlTRlAxMsU_-mUehv_iEZU/edit" target="_" className="link">design brief template</a> and read about how we relish working with <a href="https://github.com/MozillaFoundation/Design/blob/master/README.md" target="_" className="link">design contributors</a>.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Design;
