/**
 * Schedule route handlers
 *
 * @package build
 * @author  Andrew Sliwinski <a@mozillafoundation.org>
 */

var secrets = require('../config/secrets');
var form = require('../models/form');
var Github = require('../models/github');
var github = new Github(
  secrets.github.clientID,
  secrets.github.clientSecret
);

/**
 * Form post route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.createPost = function(req, res) {
  form(req, res, function(errors, body) {
    if (errors) {
      req.flash('errors', errors);
      exports.add(req, res);
    }
    else {
      github.postIssueWithToken(req.session.token, body, function(err, body) {
        if (err) res.redirect('/500');
        res.redirect(body.html_url);
      });
    }
  });
};

/**
 * "This Sprint" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.now = function(req, res) {
  github.thisMilestone(function(err, body) {
    if (err) res.redirect('/500');
    res.json({issues: body})
  });
};

/**
 * "Next Sprint" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.next = function(req, res) {
  github.nextMilestone(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({issues: body})
  });
};

/**
 * "Upcoming" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.upcoming = function(req, res) {
  github.upcomingMilestones(function(err, body) {
    if (err) res.redirect('/500');
    res.status(200).json({milestones: body})
  });
};
