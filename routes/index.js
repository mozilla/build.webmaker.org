module.exports = function(secrets) {

  return {
    api: {
      github: require( "./api/github.js")(secrets.github)
    },
    schedule: require('../server/controllers/schedule')
  };

};

