var React = require("react");

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

module.exports = Labels;