var React = require("react");

var Labels = React.createClass({
  render: function() {
    var self = this;
    var labels = self.props.labels.map( function(label) {
      var style;

      if (self.props.minimal) {
        // limit the color palette to make
        // p1s and p2s stand-out
        style = { backgroundColor: "#DDD",
                   color: "#999" };
        if ((label.name === "p1") || (label.name === "p2")) {
          style = { backgroundColor: "#FBCA04",
                    color: "#0A3931" };
        }
      } else {
        // use the label colors set in Github
        style = { backgroundColor: String(label.color),
                   color: (parseInt(label.color, 16) > 0xffffff / 2) ?
                   "0a3931" : "white"};
      }
      return <li key={label.name} style={style}>{label.name}</li>;
    });
    return (
      <ul className="labels">
      {labels}
      </ul>
    );
  }
});

module.exports = Labels;
