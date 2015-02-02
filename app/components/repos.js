
/** @jsx React.DOM */

var React = require("react");
var Firebase = require("client-firebase");
var ReactFireMixin = require("reactfire");

var Repo = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return { name: "" };
  },
  render: function() {
    return <li><a href={this.props.data.url}>
      {decodeURIComponent(this.props.name)}</a></li>;
  }
});

var RepoList = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return { repotype: this.props.repotype, repos:[] };
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase("https://debt.firebaseio.com").
                            child(this.state.repotype);
    this.bindAsObject(firebaseRef, "repos");
  },

  onChange: function(e) {
    this.setState({ repos: e.target.value });
  },

  render: function() {
    var orgs = [];
    for (var key in this.state.repos) {
      orgs.push(<Repo key={key} name={key} data={this.state.repos[key]}/>);
    }
    return (
      <ul>
      {orgs}
      </ul>
    );
  }
});

var RepoApp = React.createClass({
  render: function() {
    return (
      <div>
        <h5>Repos added by hand</h5>
          <RepoList repotype="repos-added"/>
        <h5>Repos connected by webhooks</h5>
          <RepoList repotype="repos-hooked"/>
      </div>
    );
  }
});

module.exports = RepoApp;

