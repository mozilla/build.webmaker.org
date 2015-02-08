var secrets = require('./config/secrets');
var Firebase = require('firebase');
var ref = new Firebase('https://webmakerbuild.firebaseIO.com/');
var firebase_secret = secrets.firebaseSecret;
var request = require('request');
var extractRoles = require("./extractRoles.js");

githubToken = secrets.github.token;


// console.log("FIREBASE SECRET", firebase_secret);
ref.authWithCustomToken(firebase_secret, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with firebase.");
    // console.log("Authenticated successfully with payload:", authData);
  }
});

var issues = ref.child('issues');
var asks = ref.child('asks');
asks.once('value', function(snapshot) {
  if (snapshot.val() == null) {
    asks.set({});
  }
});

function askExists(ref, flag, issue, asker, askee) {
  var asks_ref = asks.child(asker.toLowerCase());
  asks_ref.on('value', function(snapshot) {
    var asks_of_author = snapshot.val();
    for (key in asks_of_author) {
      var ask = asks_of_author[key];
      if (ask.flag == flag && ask.fromwhom == askee) {
        return true;
      }
    }
  });
  return false;
}

function recordMention(data) {
  // We should have only one mention per (issue,fromwhom,towhom) triplet
  asks.child(data.towhom.toLowerCase())
      .child(data.fromwhom.toLowerCase())
      .child(data.question)
      .child(data.issue_id).set(data)
}

function clearMentions(who, issue_id) {
  asks.child(who.toLowerCase()).on('value', function (snapshot) {
    var data = snapshot.val();
    // we need to look at all of people who have made a mention against us, and in there for matching issues
    for (var key in data) {
      if (data[key]['mention']) {
        var issues = data[key]['mention']
        for (var issue_key in issues) {
          var issue = issues[issue_key];
          if (issue.issue_id == issue_id) {
            asks.child(who.toLowerCase()).child(key).child('mention').child(issue_id).remove();
          }
        }
      }
    }
  });
}

var parseComment = function(repository, issue, comment, patchComment) {
  var fromwhom = comment.user.login;
  var body = comment.body;
  var lines = body.split('\n');
  var newlines = [];
  var patchPending = false;
  var clearedFlags = [];


  lines.forEach(function (line) {
    // DETECT NEW ASKS

    // look for things of the syntax <something>? @alias
    // turn "@bar: ui-review?" into [ "", "ui-review", "?", "bar", ";" ]
    re = /\s*@(\w*):?\s?([-\w]*)\?/i;
    var parts = line.split(re)
    if (parts.length > 1) {
      var towhom = parts[1];
      var flag = parts[2];
      if (flag != "") {
        if (! askExists(asks, flag, towhom, fromwhom)) {
          recordMention({
            'type': 'flag',
            'question': flag,
            'issue_id': issue.id,
            'body': body,
            'issue': repository.name + '/' + String(issue.number),
            'towhom': towhom,
            'fromwhom':fromwhom, 
            'ref_html_url': comment.html_url, 
            'ref_url': comment.url
          })
          line = line + " [\[flagged!\]](http://plzkthx.herokuapp.com)";
          patchPending = true;
        }
      }
    }

    // DETECT ANSWERS OF ASKS

    // Look for things like "feedback+ or "ui-review-"
    re = /\s*(\w*)([+\-])[\s]?$/i;
    var parts = line.split(re)
    if (parts.length > 1) {
      var flag = parts[1];
      var value = parts[2];
      if (value) {
        clearedFlags.push(flag);
        line = line + " [\[unflagged\]](http://plzkthx.herokuapp.com)";
        patchPending = true;
      }
    }

    var asks_ref = ref.child('asks').child(fromwhom)
    asks_ref.on('value', function(snapshot) {
      var asks_of_author = snapshot.val();
      for (bywhom in asks_of_author) {
        var ask = asks_of_author[bywhom];
        for (asktype in ask) {
          for (issue_id in ask[asktype]) {
            if (issue_id == issue.id) {
              // removing an ask
              if (clearedFlags.indexOf(ask.flag) != -1) {
                asks_ref.child(towhom).child(fromwhom).child(asktype).child(issue_id).remove();
              }
            }
          }
        }
      }
    })
    newlines.push(line);
  });

  // just check for mentions, regardless of syntax:
  matches = body.match(/(@(\w+))/gi);
  if (matches) {
    matches.forEach(function (match) {
      towhom = match.slice(1,match.length);  // get rid of @;
      if (towhom != fromwhom) { // avoid noise
        recordMention({
          'type': 'mention',
          'towhom': towhom,
          'body': body,
          'question': 'mention',
          'issue_id': issue.id,
          'issue': repository.name + '/' + String(issue.number),
          'fromwhom': fromwhom,
          'ref_html_url': comment.html_url, 
          'ref_url': comment.url
        })
      }
    })
  }

  // We want to clear any pending mention by the comment author preceding this comment
  clearMentions(fromwhom, issue.id)

  if (patchComment && patchPending) {
    // update the comment to comment to indicate it's been processed
    var newbody = newlines.join('\n');
    var owner = repository.owner.login;
    var repo = repository.name;
    var url = "https://api.github.com/repos/" + owner + '/' + repo + '/issues/comments/' + comment.id;
    url += "?access_token="+encodeURIComponent(githubToken);
    var options = {
      url: url,
      json: true,
      body: {body: newbody},
      headers: {
          'User-Agent': 'ktxhplz HTTP Client'
      }
    };
    request.patch(options, function(err, ret) {
      if (err) {
        console.log(err);
      } else {
        console.log('patched comment!')
      }
    });
  }
}

function parsePageOfIssues(pageNo, pageSize, req, repoName, ret) {
  var repository = ret.body;
  url = repository.url + '/issues';
  url += "?page="+pageNo+"&per_page="+pageSize+"&access_token="+encodeURIComponent(token);
  var options = {
    url: url,
    json: true,
    headers: {
        'User-Agent': 'NodeJS HTTP Client'
    }
  };
  request.get(options, function(err, ret) {
    if (err) {
      console.log("got error fetching issues", err);
    } else {
      // we have the issues
      for (var i=0; i<ret.body.length; i++) {
        var issue = ret.body[i];
        issues.child(issue.id).set(issue);
        parseIssueBody(repository, issue, issue.body, false);
        // then get the commentsf
        url = issue.url + "/comments?access_token="+encodeURIComponent(token);
        var options = {
          url: url,
          json: true,
          headers: {
              'User-Agent': 'NodeJS HTTP Client'
          }
        };
        function getComments(issue) {
          request.get(options, function(err, ret) {
            if (err) {
              console.log("Got error getting comments", err);
            } else {
              for (var i=0; i<ret.body.length; i++) {
                var comment = ret.body[i];
                if (issue.url != comment.issue_url) {
                  console.log("WTF", "ISSUE", issue, "\n\n\nCOMMENT", comment);
                  process.exit(0);
                }
                parseComment(repository, issue, comment, false);
              }
            }
          });
        }
        getComments(issue);
      }
    }
  });
}

function parseRepo(req, repoName) {
  token = githubToken;
  // first get repo info
  ref.child('repos-added').child(encodeURIComponent(repoName)).set(
    {'date': String(new Date()),
     'url': "https://github.com/" + repoName});
  var url = "https://api.github.com/repos/" + repoName;
  url += "?access_token="+encodeURIComponent(token);
  console.log("requesting URI", url);
  var options = {
    url: url,
    json: true,
    headers: {
        'User-Agent': 'NodeJS HTTP Client'
    }
  };
  request.get(options, function(err, ret) {
    var issueCount = Number(ret.body.open_issues_count);
    var pageSize = 100;
    var numPages = Math.ceil(issueCount / pageSize);
    for (var pageNo = 1; pageNo <= numPages; pageNo++) {
      parsePageOfIssues(pageNo, pageSize, req, repoName, ret)

    }
  });
}


function parseIssueBody(repo, issue, body, annotate) {
  var roles = extractRoles(body);
  console.log("ROLES", roles);

  roles.forEach(function (pair) {
    var role = pair[0];
    newAssignee = pair[1];
    var assignments = ref.child('assignments');
    var issueRef = ref.child("issues").child(issue.id);
    // check under /id/role for old assignee
    // if old assignee is not this assignee, remove from old_assignee/id/role
    // add to new_assignee/id/role
    issueRef.child("roles").child(role).once("value",
      function(snapshot) {
        var oldAssignee = snapshot.val();
        if (oldAssignee !== null) {
          // there was someone in this role before
          assignments.child(oldAssignee).child(issue.id).remove();
        }
        assignments.child(newAssignee).child(issue.id).set(role);
        issueRef.child("_roles").child(role).set(newAssignee);
      }
    );
  });
}

var processHook = function(req, res) {
  var eventType = req.headers['x-github-event'];
  var encodedRepoName = encodeURIComponent(req.body.repository.full_name);
  console.log("GOT HOOK, encodedRepoName", encodedRepoName);
  ref.child('repos-hooked').child(encodedRepoName)
   .set({'date': String(new Date()),
         'url': req.body.repository.html_url});

  // If repo not in repos-added then scan it from here.
  ref.child('repos-added').child(encodedRepoName).once("value", function(snapshot) {
    var exists = (snapshot.val() !== null);
    if (! exists) {
      console.log("Parsing the repo from scratch", req.body.repository.full_name);
      parseRepo(req, req.body.repository.full_name);
    }
  });

  if (eventType == 'issues') {
    // This is a new issue
    var issue = issues.child(req.body.issue.id)
    issue.set(req.body.issue);
    parseIssueBody(req.body.repository, req.body.issue, req.body.issue.body, false);
  } else if (eventType == 'issue_comment') {
    // a new comment
    // refresh the issue body in case it's changed and wasn't noticed.
    parseIssueBody(req.body.repository, req.body.issue, req.body.issue.body, false);

    var issue = issues.child(req.body.issue.id);
    issue.transaction(function(currentIssue) {
      if (currentIssue == null) {
        issue.set(req.body.issue);
      }
      issue.child('comments').child(req.body.comment.id).set(req.body.comment);
      parseComment(req.body.repository, req.body.issue, req.body.comment, false);
    })
  }
  res.sendStatus(200);
};

module.exports.processHook = processHook;
module.exports.parseRepo = parseRepo;
