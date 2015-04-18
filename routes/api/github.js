var getAll = require('get-all');
//var config = require("./config.js");
//var auth = config.get("GITHUB_AUTH");
var request = require('request');

var orgs = ["MozillaFoundation", "MozillaScience"];
var mozillaRepos = "id.webmaker.org webmaker-curriculum snippets teach.webmaker.org goggles.webmaker.org webmaker-tests sawmill login.webmaker.org openbadges-badgekit webmaker-app api.webmaker.org popcorn.webmaker.org webmaker-mediasync webmaker.org webmaker-app-cordova webmaker-metrics nimble mozilla-opennews teach-api mozillafestival.org call-congress-net-neutrality thimble.webmaker.org advocacy.mozilla.org privacybadges webmaker-profile-2 call-congress build.webmaker.org webmaker-landing-pages webliteracymap events.webmaker.org badgekit-api openbadges-specification make-valet webmaker-auth webmaker-events-service webmaker-language-picker MakeAPI blog.webmaker.org webmaker-login-ux webmaker-desktop webmaker-app-publisher badges.mozilla.org lumberyard webmaker-download-locales webmaker-addons bsd-forms-and-wrappers popcorn-js hivelearningnetworks.org webmaker-firehose makeapi-client makerstrap webmaker-app-bot webmaker-screenshot react-i18n webmaker-kits-builder webmaker-app-guide".split(" ");

// Has not been touched this year.
// eoy-fundraising openbadges-validator studiomofo node-webmaker-i18n eoy-charts slowparse openbadges-bakery-service openbadges-backpack popcorn-docs mofo-design makedrive openbadges-badges nimble.webmaker.org 2014.mozillafestival.org badge-the-world webmaker-suite webmaker-auth-client webmaker-analytics parapara school-of-webmaking openbadges-cem makerparty badgekit-api-client webmaker-locales-mapping-configuration webmaker-whitepaper makeapi-docs mozilla-badges friendlycode webmaker-personas node-webmaker-postalservice filer-redis hackablegames webmaker-user-client hookshot webmaker-profile-service webmaker-profile webmaker-kits django-badgekit badgekit-backpack webmaker-rid openbadges-bakery node-hubble openbadges-discovery htmlsanitizer.org webmaker-events openbadges-validator-service badgekit-api-python-client mozbadging mozilla-ignite openbadger webmaker-translation-stats mozillawebmakerproxy.net openbadges.org web-literacy-client mozilla-bsd-cache webmaker-login-example MakeAPI-Gallery webmaker-ui sciencelab badg.us node-webmaker-loginapi".split(" ");

// Just really old.
// butter ceci openbadges-badgestudio appmaker-components teach-appmaker content-2012.mozillafestival.org badges.mozillafestival.org openbadger-client node-webmaker-butler badgeopolis openbadges-backpack-archived ceci-bower appmaker-words popcornjs.org make.mozilla.org wp.mozilla-ignite.org community.openbadges.org mozilla-ignite-learning-lab-demos webmaker-firehose-archive openbadges-verifier webmaker-nav mozilla-ignite-learning-lab-videos webmakers-tumblr popcorn_maker splash.mozilla-ignite.org popcorn-interim".split(" ");

module.exports = function(githubSecrets) {


  function githubRequest(options, callback) {
    var accessToken = githubSecrets.token;
    var url = "https://api.github.com/" + options.query + "?access_token=" + accessToken + "&page=";
    var collection = [];

    // Fetch deals with multiple pages.
    // The data this code deals with is small enough,
    // so just return all pages worth of data.
    function fetch(page) {
      request({
        url: url + page,
        headers: {
          "user-agent": "build.webmaker.org" // GitHub is a diva without a unique user agent
        }
      }, function(error, response, body) {
        var data = JSON.parse(body);
        if (data.length) {
          collection = collection.concat(data);
          // We have new data, keep going.
          fetch(++page);
        } else if (collection.length) {
          // Looks like we're done.
          callback(error, collection);
        } else {
          // Likely dealing with non array data. We can stop.
          callback(error, data);
        }
      });
    }

    fetch(0);
  }

  githubRequest({query:"rate_limit"}, function(err, data) {
    console.log("Github API requests left: " + data.rate.remaining);
  });

  return {
    repos: function(req, res) {
      var repos = [];
      
      var waiting = orgs.length;

      orgs.forEach(function(org) {
        githubRequest({
          query: "orgs/" + org + "/repos"
        }, function(err, results,response) {
          waiting--;
          if (err) {
            console.log(err);
          } else {
            results.forEach(function(repo) {
              repos.push(repo);
            });
            if (!waiting) {
              res.json( repos );
            }
          }
        });
      });
    },
    repoNames: function(req, res) {
      var repoNames = [];
      var repos = [];
      request("http://localhost:8080/github/repos", function (error, response, body) {
        if (!error && response.statusCode == 200) {
          repos = JSON.parse(body);
          
          repos.forEach(function(repo) {
            repoNames.push(repo.full_name);
          });

          res.json( repoNames.concat(mozillaRepos.map(function(item) {
            return "mozilla/" + item;
          })) );
        }
      });
    },
    users: function(req, res) {
      var users = [];
      var waiting = orgs.length;

      orgs.forEach(function(org) {
        githubRequest({
          query: "orgs/" + org + "/members"
        }, function(err, results) {
          waiting--;
          if (err) {
            console.log(err);
          } else {
            results.forEach(function(user) {
              users.push(user.login);
            });
            if (!waiting) {
              res.json( users );
            }
          }
        });
      });
    },
    milestones: function(req, res) {

      request("http://localhost:8080/github/repos", function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var repos = JSON.parse(body);
          var waiting = repos.length + mozillaRepos.length;
          var collection = [];

          mozillaRepos.forEach(function(repo) {
            githubRequest({
              query: "repos/mozilla/" + repo + "/milestones"
            }, function(err, results) {
              waiting--;
              if (err) {
                console.log(err);
              } else {
                results.forEach(function(item) {
                  collection.push(item.title);
                });
                if (!waiting) {
                  res.json( collection );
                }
              }
            });
          });
          repos.forEach(function(repo) {
            githubRequest({
              query: "repos/" + repo.owner.login + "/" + repo.name + "/milestones"
            }, function(err, results) {
              waiting--;
              if (err) {
                console.log(err);
              } else {
                results.forEach(function(item) {
                  collection.push(item.title);
                });
                if (!waiting) {
                  res.json( collection );
                }
              }
            });
          });
        }
      });
    },
    labels: function(req, res) {
      request("http://localhost:8080/github/repos", function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var repos = JSON.parse(body);
          var waiting = repos.length + mozillaRepos.length;
          var collection = [];

          repos.forEach(function(repo) {
            githubRequest({
              query: "repos/" + repo.owner.login + "/" + repo.name + "/labels"
            }, function(err, results) {
              waiting--;
              if (err) {
                console.log(err);
              } else {
                results.forEach(function(item) {
                  collection.push(item.name);
                });
                if (!waiting) {
                  res.json( collection );
                }
              }
            });
          });

          mozillaRepos.forEach(function(repo) {
            githubRequest({
              query: "repos/mozilla/" + repo + "/labels"
            }, function(err, results) {
              waiting--;
              if (err) {
                console.log(err);
              } else {
                results.forEach(function(item) {
                  collection.push(item.name);
                });
                if (!waiting) {
                  res.json( collection );
                }
              }
            });
          });
        }
      });
    }
  };

};

