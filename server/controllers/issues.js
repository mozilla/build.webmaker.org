/**
 * My Issues route handlers
 *
 * @package build
 */

var secrets = require('../config/secrets');
var Github = require('../models/github');
var github = new Github(secrets.githubToken);

/**
 * "Assigned Tickets" route handler.
 */
exports.myAssigned = function(req, res) {
  github.myIssuesAssigned(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({issues: body});
  });
};

/**
 * "Subscribed Tickets" route handler.
 */
exports.mySubscribed = function(req, res) {
  github.myIssuesSubscribed(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({issues: body});
  });
};

/**
 * "Mentioned Tickets" route handler.
 */
exports.myMentioned = function(req, res) {
  github.myIssuesMentioned(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({issues: body});
  });
};

/**
 * "Created Tickets" route handler.
 */
exports.myCreated = function(req, res) {
  github.myIssuesCreated(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({issues: body});
  });
};

