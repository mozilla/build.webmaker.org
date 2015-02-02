var React = require("react");
var getJSON = require("./getJSON.jsx");

var GitHubPerson = React.createClass({
  getInitialState: function() {
    /* We are given a github name */
    return {
      username: "",
      name: "",
      avatar_url: ""
    };
  },

  componentDidMount: function() {
    var handle = this.props.handle.toLowerCase();
    var that = this;
    getJSON("/api/user/"+handle, function(data) {
      if (data.avatar_url.indexOf("?") !== -1) {
        data.avatar_url = data.avatar_url + "&s=64";
      } else {
        data.avatar_url = data.avatar_url + "?s=64";
      }
      if (that.isMounted()) {
        that.setState({
        username: data.login,
        htlm_url: data.html_url,
        avatar_url: data.avatar_url,
        name: data.name
      });
      }
    }, function(error, data) {
      console.log("GOT ERROR", error, data);
    });
  },

  render: function() {
    return (
        <div className="profile-pic">
          <a href={this.state.html_url} title={this.state.name}>
            <img className="profile-pic-btn" src={this.state.avatar_url}/>
          </a>
        </div>
      );
  }
});

module.exports = GitHubPerson;