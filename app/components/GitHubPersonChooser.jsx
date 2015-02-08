var React = require("react");
var getJSON = require("./getJSON.jsx");
var Select = require("react-select");

var GitHubPerson = React.createClass({
  getInitialState: function() {
    /* We are given a github name */
    return {
      members: [],
    };
  },

  componentDidMount: function() {
    var team = this.props.team.toLowerCase();
    var that = this;
    // XXX Ensure this is cached
    getJSON("/api/team/"+team, function(members) {
      console.log(members);
      if (that.isMounted()) {
        var data = members.map(function(member) {
          var name = member.name;
          if (!name || name === undefined) {
            name = "no name in github profile";
          }
          return {label: "@"+member.login+ " ("+name+ ")",
                  value: "@"+member.login};
        });
        that.setState({
          members: data
        });
      }
    }, function(error, data) {
      console.log("GOT ERROR", error, data);
    });
  },

  render: function() {
    return <Select name={this.props.name} options={this.state.members}/>;
  }
});

module.exports = GitHubPerson;