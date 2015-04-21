module.exports = function(app, secrets) {

  return {
    api: {
      github: require( "./api/github.js")(app, secrets.github)
    },
    schedule: require('../server/controllers/schedule')
  };

};

