/** @jsx React.DOM */

var React = require("react");
var ReactFireMixin = require("reactfire");
var Firebase = require("client-firebase");
// var readCookie  = require("./readcookie.js");
var GitHubPerson = require("./GitHubPerson.jsx");

var Mention = React.createClass({
  getInitialState: function() {
    return {"issue": {"state": "open", "title": "", "url":""}};
  },
  componentDidMount: function() {
    var comp = this;
    var issuesRef = new Firebase("https://debt.firebaseio.com/issues")
                         .child(this.props.comment.issue_id).on("value",
      function(snapshot) {
        var issue = snapshot.val();
        if (issue) {
          comp.setState({"issue": issue});
        }
      });
    // get info from the issues firebase and set some properties based on that
  },
  dismiss: function(fbid) {
    var firebaseRef = new Firebase("https://debt.firebaseio.com/asks")
                            .child(fbid).update({"dismissed": "true"});
  },
  linesplit: function(thestring) {
    var lines = thestring.split("\n");
    var bits = lines.map(function(line) {
      return <span className="line">{line}</span>;
    });
    return <div>{bits}</div>;
  },
  parseBody: function(body) {
    if (!body) {
      return <span/>;
    }
    var mentionIndex = body.toLowerCase()
                           .indexOf("@"+this.props.handle.toLowerCase());
    var beginning = body;
    var ending = Math.min(mentionIndex+("@"+this.props.handle).length + 50,
                                        body.length);
    var before = body.slice(beginning, mentionIndex);
    var indexOfLastNewline = before.lastIndexOf("\n");
    if (indexOfLastNewline === -1) {
      indexOfLastNewline = 0;
    }
    before = before.slice(indexOfLastNewline, -1);
    // go back another line
    indexOfLastNewline = before.lastIndexOf("\n");
    if (indexOfLastNewline === -1) {
      indexOfLastNewline = 0;
    }
    before = before.slice(indexOfLastNewline);
    if (indexOfLastNewline !== 0) {
      before = "…" + before;
    }
    var after = body.slice(mentionIndex +
                           ("@"+this.props.handle).length, ending);
    if (ending !== body.length) {
      after = after + "…";
    }
    var middle = body.slice(mentionIndex, mentionIndex +
                            ("@"+this.props.handle).length);

    return <span>{before} <b>{middle}</b> {after}</span>;
  },

  render: function() {
    var comment = this.props.comment;
    var className = this.state.issue.state === "closed" ?
                      "mention hidden" : "mention";
    var issue_url = comment.ref_url;
    var repo_name = "";
    if (issue_url) {
      repo_name = issue_url.slice(
        issue_url.indexOf("/repos/")+"/repos/".length) ;
      repo_name = repo_name.slice(0,
                                  repo_name.indexOf("/issues/"));
    }
    if (this.props.question === "mention") {
      var loggedinUser = "davidascher"; // XXX readCookie("githubuser");
      var dismiss = this.dismiss.bind(this, this.props.issue_id);
      var trashcan;
      if (loggedinUser === this.props.handle) {
        trashcan = <a className="dismiss" href="#"
                      onClick={dismiss}><i className="fa fa-trash" ></i></a>;
      } else {
        trashcan = <span/>;
      }
      if (!comment.body) {
        console.log("WTF", comment);
      }
      var parsedBody = this.parseBody(comment.body);
      if (! comment.dismissed) {
        return (<li className={className}>
                  <div className="profile-pic-wrap">
                    <GitHubPerson handle={comment.fromwhom}/>
                  </div>
                  <div className="mentionblock">
                    <div>{repo_name}/
                      <a href={comment.ref_html_url}>
                        {this.state.issue.title}
                      </a> : {trashcan}
                    </div>
                    <div className="comment">{parsedBody}</div>
                  </div>
                </li>);
      } else {
        return <span></span>;
      }
    } else {
      return(<li className={className}>
                <div className="profile-pic-wrap">
                  <GitHubPerson handle={comment.fromwhom }/>
                </div>
                <div className="mentionblock">
                  <b>{comment.fromwhom }</b> asked for <b>{comment.question}</b> in {repo_name}/<a href={comment.ref_html_url}>{this.state.issue.title}</a>
                </div>
              </li>);
    }
  }
});

var MentionsList = React.createClass({
  render: function() {
    var bits = [];
    var mentions = this.props.mentions;
    for (var fromwhom in mentions) {
      // looking at the asks from "fromwhom"
      if (! mentions.hasOwnProperty(fromwhom)) {
        continue;
      }
      var tomefromthem = mentions[fromwhom];
      // tomefromthem will be the same
      for (var question in tomefromthem) {
        if (! tomefromthem.hasOwnProperty(question)) {
          continue;
        }
        for (var issue_id in tomefromthem[question]) {
          if (! tomefromthem[question].hasOwnProperty(issue_id)) {
            continue;
          }
          var comment = tomefromthem[question][issue_id];
          if (comment.type !== this.props.type) {
            continue;
          }
          var unique_id = this.props.handle + "/" +
                          fromwhom + "/" +
                          question + "/" +
                          comment.issue_id;
          bits.push(<Mention key={unique_id}
                     issue_id={unique_id}
                     handle={this.props.handle}
                     question={question}
                     comment={comment}/>);
        }
      }
    }
    if (bits.length > 0) {
      return (<div><h3 className="mentionsheading">{this.props.title}</h3>
                   <ul className="mentionsul"> {bits} </ul>
              </div>);
    } else {
      return (<div></div>);
    }
  }
});

var MentionsApp = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {handle: this.props.handle};
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase("https://debt.firebaseio.com/asks").child(this.state.handle.toLowerCase());
    this.bindAsObject(firebaseRef, "mentions");
  },

  onChange: function(e) {
    this.setState({handle: e.target.value});
  },

  render: function() {
    return (
      <div>
        <MentionsList title="Pending Flags" type="flag" handle={this.state.handle} mentions={this.state.mentions}/>
        <MentionsList title="Pending Mentions" type="mention" handle={this.state.handle} mentions={this.state.mentions}/>
      </div>
    );
  }
});


module.exports = MentionsApp;
