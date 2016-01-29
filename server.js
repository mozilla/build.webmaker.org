/**
 * HTTP server for build.webmaker.org
 *
 * @package build
 * @author  David Ascher <davida@mozillafoundation.org>
 *          Andrew Sliwinski <a@mozillafoundation.org>
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var helmet = require('helmet');

var sessions = require('client-sessions');
var flash = require('express-flash');
var path = require('path');
var cors = require('cors');
var expressValidator = require('express-validator');
var issueParser = require('./server/issueparser.js');
var processHook = issueParser.processHook;
var request = require( "request" );

/**
 * Import API keys from environment
 */
var secrets = require('./server/config/secrets');

/**
 * Github handlers
 */
var githubCacheAge = 60 * 60 * 1000; // every hour
var Github = require('./server/models/github');
var github = new Github(secrets.github, githubCacheAge);

/**
 * Create Express server.
 */
var app = express();

/**
 * Controllers (route handlers).
 */
var routes = require( "./routes" )();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.set('host', process.env.HOST || "http://localhost");
app.set('github_org', 'MozillaFoundation');
app.set('github_repo', 'plan');

app.use(helmet());
app.use(sessions({
  cookieName: 'session',
  secret: secrets.sessionSecret,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));
app.use(compress()); // Note: this messes up JSON view in firefox dev tools
app.use(express.static(
  path.join(__dirname, './app/public'), { maxAge: 1000 * 3600 * 24 * 365.25 })
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(flash());
app.use(cors());
app.use(github.middleware);

/**
 * Controllers (route handlers).
 */
var routes = {
  schedule: require('./server/controllers/schedule'),
  issues: require('./server/controllers/issues')
};

/**
 * Main routes.
 */
app.post('/api/add', routes.schedule.createPost);
app.get('/api/now', routes.schedule.now);
app.get('/api/next', routes.schedule.next);
app.get('/api/upcoming', routes.schedule.upcoming);
app.get('/api/team/:team', function(req, res) {
  github.teamMembers(req.params.team, function(err, body) {
    if (err) res.redirect('/500');
    res.type('application/json; charset=utf-8').send(body);
  });
});
app.get('/api/github/search/issues', function(req, res) {
  var sort = req.query.sort || 'updated';
  var order = req.query.order || 'asc';
  github.search(req.query.q, sort, order, function(err, body) {
    if (err) res.redirect('/500');
    res.type('application/json; charset=utf-8').send(body);
    // res.type('application/json').send(body);
  });
});
app.get('/api/user/:username', function(req, res) {
  github.getUserInfo(req.params.username, function(err, body) {
    if (err) res.redirect('/500');
    res.type('application/json').send(body);
  });
});
app.get('/api/myissues/assigned', routes.issues.myAssigned);
app.get('/api/myissues/subscribed', routes.issues.mySubscribed);
app.get('/api/myissues/mentioned', routes.issues.myMentioned);
app.get('/api/myissues/created', routes.issues.myCreated);

function oauthCB(req, res, path) {
  var oauth = require('github-oauth')({
    githubClient: secrets.github.clientID,
    githubSecret: secrets.github.clientSecret,
    baseURL: secrets.github.host,
    callbackURI: secrets.github.callbackURL + '/' + path,
    loginURI: '/login',
    scope: 'public_repo' // we need this to be able to create issues.
  });
  oauth.login(req, res);
}

app.get('/auth/github/:path', function(req, res) {
  oauthCB(req, res, req.params.path);
});
app.get('/auth/github', function(req, res) {
  oauthCB(req, res, '');
});

function processCallback(req, res, path) {
  var oauth = require('github-oauth')({
    githubClient: secrets.github.clientID,
    githubSecret: secrets.github.clientSecret,
    baseURL: secrets.github.host,
    callbackURI: secrets.github.callbackURL + path,
    loginURI: '/login',
    scope: ''
  });
  oauth.callback(req, res, function (err, body) {
    if (err) {
      req.flash('errors', {msg: err});
    } else {
      req.session.token = body.access_token;
      // Get User information, and send it in a cookie
      github.getUserFromToken(body.access_token, function(err, body) {
        if (!err) {
          // For some reason, this results in a cookie w/ "j$3A" at the front, which confuses me:
          //     "github=j%3A%7B%22body%22%3A%7B%22login... ....qTKzGvAWm5ElZZ9PwUtZs4FAyDkOPtno9480FIX1P0A; path=/; expires=Mon, 02 Feb 2015 19:32:02 GMT; httponly"
          res.cookie('github', body, { maxAge: 900000 });

          // res.redirect("/#/"+path); // Remove this when we move away from # URLs
          res.redirect('/'+path); // Remove this when we move away from # URLs
        }
      });
    }
  });
}
app.get('/auth/callback/:path', function (req, res) {
  processCallback(req, res, req.params.path);
});
app.get('/auth/callback', function (req, res) {
  processCallback(req, res, '');
});


app.post('/postreceive', processHook);


app.get('/logout', function (req, res) {
  req.session.token = null;
  res.redirect('/');
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/add', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/next', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/now', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/upcoming', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/design', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/audience', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/dashboards', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/myissues', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/bugs', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});
app.get('/issues', function(req, res) {
  res.sendFile(path.join(__dirname, './app/public/index.html'));
});

app.get( "/api/github/mozilla-repo-names", function(req, res) {
  // Get Foundation repos then merge them with a static list of mozilla repos.
  github.getMozillaRepos(function(err, results) {
    if (err) {
      // Not sure what to do with errors, yet.
      console.log(err);
    } else {
      res.json(results);
    }
  });
});
app.get( "/api/github/foundation-users", function(req, res) {
  github.getFoundationUsers(function(err, results) {
    if (err) {
      // Not sure what to do with errors, yet.
      console.log(err);
    } else {
      res.json(results);
    }
  });
});
app.get( "/api/github/mozilla-labels", function(req, res) {

  github.getMozillaRepos(function(err, repos) {
    if (err) {
      // Not sure what to do with errors, yet.
      console.log(err);
    } else {
      github.getLabelsForRepos(repos, function(err, results) {
        if (err) {
          // Not sure what to do with errors, yet.
          console.log(err);
        } else {
          res.json(results);
        }
      });
    }
  });
});
app.get( "/api/github/mozilla-milestones", function(req, res) {

  github.getMozillaRepos(function(err, repos) {
    if (err) {
      // Not sure what to do with errors, yet.
      console.log(err);
    } else {
      github.getMilestonesForRepos(repos, function(err, results) {
        if (err) {
          // Not sure what to do with errors, yet.
          console.log(err);
        } else {
          res.json(results);
        }
      });
    }
  });
});

function primeCache( urlPrefix ) {
  [
    { url: "/api/github/mozilla-repo-names" },
    { url: "/api/github/foundation-users" },
    { url: "/api/github/mozilla-labels" },
    { url: "/api/github/mozilla-milestones" }
 ].forEach( function( resource ) {
    var url = resource.url;

    function updateResource() {
      request.get( urlPrefix + url, function( err, resp, body ) {
        if ( err ) {
          return console.log( "Error updating cache entry for %s: %s", url, err );
        }
      });
    }

    // Setup a timer to do this update, and also do one now
    updateResource();
    setInterval( updateResource, githubCacheAge ).unref();
 });
}

// Cache a few urls so the user always uses cache and never needs to wait.
primeCache(app.get("host") + ":" + app.get('port'));

github.githubRequestAllPages({query:"rate_limit"}, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("Github API requests left: " + data.rate.remaining);
  }
});

/**
 * Webhook handler (from github)
 */

/**
 * 500 Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
