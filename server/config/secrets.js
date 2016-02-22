var Habitat = require('habitat');
Habitat.load('.env');
Habitat.load('config/production.env');

var env = new Habitat('plan');

module.exports = {
  sessionSecret: process.env.SESSION_SECRET || env.get('session_secret'),
  firebaseSecret: process.env.FIREBASE_SECRET || env.get('firebase_secret'),
  githubToken: env.get('GITHUB_TOKEN')
};
